"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { 
  sendConnectionRequest, 
  respondToConnectionRequest, 
  getConnections, 
  getConnectionRequests, 
  getActivityFeed, 
  searchUsers,
  getConversation
} from "@/lib/api"
import { useRouter } from "next/navigation"
import { 
  Users, 
  UserPlus, 
  Search, 
  Bell, 
  Activity,
  MapPin,
  Mail,
  Check,
  X,
  Clock,
  Briefcase,
  Heart,
  MessageCircle,
  Share,
  Eye,
  Calendar,
  Award,
  Camera,
  Music,
  Palette
} from "lucide-react"

export default function NetworkPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("discover")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [connections, setConnections] = useState([])
  const [connectionRequests, setConnectionRequests] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(false)

  // Load data from API on component mount
  useEffect(() => {
    loadNetworkData()
  }, [])

  const loadNetworkData = async () => {
    try {
      setLoading(true)
      // Load connections, requests, and activities in parallel
      const [connectionsRes, requestsRes, activitiesRes] = await Promise.all([
        getConnections({ status: "accepted" }),
        getConnectionRequests(),
        getActivityFeed({ limit: 10 })
      ])

      setConnections(connectionsRes.connections || [])
      setConnectionRequests(requestsRes.requests || [])
      setActivities(activitiesRes.activities || [])
    } catch (error: any) {
      console.error("Error loading network data:", error)
      alert(error.message || "Failed to load network data. Please try again.")
      // Fallback to dummy data if API fails
      loadDummyData()
    } finally {
      setLoading(false)
    }
  }

  const loadDummyData = () => {
    // Fallback dummy data
    setConnections([
      {
        _id: "1",
        requester: { fullName: "John Doe", userCategory: "artist", userCategoryType: "Painter", city: "Mumbai", country: "India" },
        recipient: { fullName: "You", userCategory: "company" },
        status: "accepted",
        connectionType: "professional",
        createdAt: "2025-09-20T10:00:00Z"
      }
    ])
    setConnectionRequests([])
    setActivities([])
    setSearchResults([])
  }

  const handleSearch = async () => {
    if (searchQuery.length < 2) return
    
    setLoading(true)
    try {
      const response = await searchUsers({ q: searchQuery, limit: 20 })
      setSearchResults(response.users || [])
    } catch (error) {
      console.error("Search error:", error)
      // Fallback to dummy search results
      setSearchResults([
        {
          _id: "10",
          fullName: "David Kumar",
          userCategory: "artist",
          userCategoryType: "Video Editor",
          city: "Bangalore",
          country: "India",
          connectionStatus: null
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleConnectionRequest = async (userId: string) => {
    try {
      const response = await sendConnectionRequest({ 
        recipientId: userId, 
        message: "Hi! I'd like to connect with you.",
        connectionType: "professional"
      })
      
      if (response.success) {
        // Update UI optimistically
        setSearchResults(prev => 
          prev.map(user => 
            user._id === userId 
              ? { ...user, connectionStatus: "pending" }
              : user
          )
        )
        alert("Connection request sent successfully!")
      }
    } catch (error: any) {
      console.error("Connection request error:", error)
      alert(error.message || "Failed to send connection request. Please try again.")
    }
  }

  const handleConnectionResponse = async (connectionId: string, status: "accepted" | "declined") => {
    try {
      const response = await respondToConnectionRequest(connectionId, status)
      
      if (response.success) {
        // Update UI optimistically
        setConnectionRequests(prev => 
          prev.filter(req => req._id !== connectionId)
        )
        
        if (status === "accepted") {
          // Add to connections
          const request = connectionRequests.find(req => req._id === connectionId)
          if (request) {
            const newConnection = {
              _id: connectionId,
              requester: request.requester,
              recipient: { fullName: "You", userCategory: "company" },
              status: "accepted",
              connectionType: "professional",
              createdAt: new Date().toISOString()
            }
            setConnections(prev => [newConnection, ...prev])
          }
          alert("Connection accepted!")
        } else {
          alert("Connection request declined.")
        }
      }
    } catch (error: any) {
      console.error("Connection response error:", error)
      alert(error.message || "Failed to respond to connection request. Please try again.")
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "job_applied": return <Briefcase className="h-5 w-5 text-blue-500" />
      case "post_created": return <MessageCircle className="h-5 w-5 text-green-500" />
      case "event_created": return <Calendar className="h-5 w-5 text-purple-500" />
      case "skill_added": return <Award className="h-5 w-5 text-yellow-500" />
      default: return <Activity className="h-5 w-5 text-primary" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Painter": return <Palette className="h-4 w-4" />
      case "Photographer": return <Camera className="h-4 w-4" />
      case "Musician": return <Music className="h-4 w-4" />
      case "Dancer": return <Users className="h-4 w-4" />
      default: return <Briefcase className="h-4 w-4" />
    }
  }

  const handleMessageUser = async (userId: string) => {
    try {
      // Get or create conversation with the user
      const response = await getConversation(userId)
      if (response.success) {
        // Navigate to messages page
        router.push('/messages')
      }
    } catch (error: any) {
      console.error("Error starting conversation:", error)
      alert(error.message || "Failed to start conversation. Please try again.")
    }
  }

  return (
    <div className="container max-w-6xl py-6 text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Network</h1>
        <p className="text-gray-400">Connect with professionals and grow your network</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-[#1f1f1f] border-[#2f2f2f]">
          <TabsTrigger value="discover" className="data-[state=active]:bg-[#2a2a2a]">
            <Search className="h-4 w-4 mr-2" />
            Discover
          </TabsTrigger>
          <TabsTrigger value="connections" className="data-[state=active]:bg-[#2a2a2a]">
            <Users className="h-4 w-4 mr-2" />
            Connections ({connections.length})
          </TabsTrigger>
          <TabsTrigger value="requests" className="data-[state=active]:bg-[#2a2a2a]">
            <Bell className="h-4 w-4 mr-2" />
            Requests ({connectionRequests.length})
          </TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-[#2a2a2a]">
            <Activity className="h-4 w-4 mr-2" />
            Activity Feed
          </TabsTrigger>
        </TabsList>

        {/* Discover Tab */}
        <TabsContent value="discover" className="space-y-6">
          <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
            <CardHeader>
              <CardTitle className="text-white">Find People</CardTitle>
              <CardDescription className="text-gray-400">
                Search for professionals to connect with
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by name, company, or location..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="pl-10 bg-[#2a2a2a] border-[#3f3f3f] text-white"
                    />
                  </div>
                  <Button 
                    onClick={handleSearch}
                    disabled={loading || searchQuery.length < 2}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {loading ? "Searching..." : "Search"}
                  </Button>
                </div>
                
                {/* Advanced Search Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <select className="bg-[#2a2a2a] border-[#3f3f3f] text-white rounded px-3 py-2">
                    <option value="">All Categories</option>
                    <option value="actor">Actors</option>
                    <option value="musician">Musicians</option>
                    <option value="painter">Painters</option>
                    <option value="director">Directors</option>
                    <option value="technician">Technicians</option>
                  </select>
                  
                  <select className="bg-[#2a2a2a] border-[#3f3f3f] text-white rounded px-3 py-2">
                    <option value="">All Locations</option>
                    <option value="mumbai">Mumbai</option>
                    <option value="delhi">Delhi</option>
                    <option value="bangalore">Bangalore</option>
                    <option value="chennai">Chennai</option>
                    <option value="hyderabad">Hyderabad</option>
                  </select>
                  
                  <select className="bg-[#2a2a2a] border-[#3f3f3f] text-white rounded px-3 py-2">
                    <option value="">Experience</option>
                    <option value="0-2">0-2 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="6-10">6-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                  
                  <select className="bg-[#2a2a2a] border-[#3f3f3f] text-white rounded px-3 py-2">
                    <option value="">Availability</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="freelance">Freelance</option>
                    <option value="project-based">Project-based</option>
                  </select>
                </div>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Search Results</h3>
                  {searchResults.map((user) => (
                    <div key={user._id} className="p-4 bg-[#2a2a2a] rounded-lg border border-[#3f3f3f]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                            {getCategoryIcon(user.userCategoryType)}
                          </div>
                          <div>
                            <h4 className="text-white font-medium">{user.fullName}</h4>
                            <p className="text-gray-400 text-sm">
                              {user.userCategory} • {user.userCategoryType}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <MapPin className="h-3 w-3" />
                              {user.city}, {user.country}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {user.connectionStatus === "pending" && (
                            <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                              Pending
                            </Badge>
                          )}
                          {user.connectionStatus === "accepted" && (
                            <Badge variant="outline" className="border-green-500 text-green-500">
                              Connected
                            </Badge>
                          )}
                          {!user.connectionStatus && (
                            <Button
                              size="sm"
                              onClick={() => handleConnectionRequest(user._id)}
                              className="bg-primary hover:bg-primary/90"
                            >
                              <UserPlus className="h-4 w-4 mr-1" />
                              Connect
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Default suggestions when no search */}
              {searchQuery.length === 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Suggested Connections</h3>
                  {searchResults.slice(0, 3).map((user) => (
                    <div key={user._id} className="p-4 bg-[#2a2a2a] rounded-lg border border-[#3f3f3f]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                            {getCategoryIcon(user.userCategoryType)}
                          </div>
                          <div>
                            <h4 className="text-white font-medium">{user.fullName}</h4>
                            <p className="text-gray-400 text-sm">
                              {user.userCategory} • {user.userCategoryType}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <MapPin className="h-3 w-3" />
                              {user.city}, {user.country}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {user.connectionStatus === "pending" && (
                            <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                              Pending
                            </Badge>
                          )}
                          {user.connectionStatus === "accepted" && (
                            <Badge variant="outline" className="border-green-500 text-green-500">
                              Connected
                            </Badge>
                          )}
                          {!user.connectionStatus && (
                            <Button
                              size="sm"
                              onClick={() => handleConnectionRequest(user._id)}
                              className="bg-primary hover:bg-primary/90"
                            >
                              <UserPlus className="h-4 w-4 mr-1" />
                              Connect
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Connections Tab */}
        <TabsContent value="connections" className="space-y-6">
          <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
            <CardHeader>
              <CardTitle className="text-white">Your Connections</CardTitle>
              <CardDescription className="text-gray-400">
                People you're connected with ({connections.length} connections)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {connections.map((connection) => (
                  <div key={connection._id} className="p-4 bg-[#2a2a2a] rounded-lg border border-[#3f3f3f]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                          {getCategoryIcon(connection.requester.fullName === "You" 
                            ? connection.recipient.userCategoryType 
                            : connection.requester.userCategoryType)}
                        </div>
                        <div>
                          <h4 className="text-white font-medium">
                            {connection.requester.fullName === "You" 
                              ? connection.recipient.fullName 
                              : connection.requester.fullName}
                          </h4>
                          <p className="text-gray-400 text-sm">
                            {connection.requester.fullName === "You" 
                              ? `${connection.recipient.userCategory} • ${connection.recipient.userCategoryType}`
                              : `${connection.requester.userCategory} • ${connection.requester.userCategoryType}`}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <MapPin className="h-3 w-3" />
                            {connection.requester.fullName === "You" 
                              ? `${connection.recipient.city}, ${connection.recipient.country}`
                              : `${connection.requester.city}, ${connection.requester.country}`}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-primary/20 text-primary">
                          {connection.connectionType}
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-[#3f3f3f] text-white hover:bg-ink-hover"
                          onClick={() => handleMessageUser(
                            connection.requester.fullName === "You" 
                              ? connection.recipient._id 
                              : connection.requester._id
                          )}
                        >
                          <Mail className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Connection Requests Tab */}
        <TabsContent value="requests" className="space-y-6">
          <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
            <CardHeader>
              <CardTitle className="text-white">Connection Requests</CardTitle>
              <CardDescription className="text-gray-400">
                People who want to connect with you ({connectionRequests.length} pending)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {connectionRequests.map((request) => (
                  <div key={request._id} className="p-4 bg-[#2a2a2a] rounded-lg border border-[#3f3f3f]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                          {getCategoryIcon(request.requester.userCategoryType)}
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{request.requester.fullName}</h4>
                          <p className="text-gray-400 text-sm">
                            {request.requester.userCategory} • {request.requester.userCategoryType}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <MapPin className="h-3 w-3" />
                            {request.requester.city}, {request.requester.country}
                          </div>
                          {request.message && (
                            <p className="text-gray-300 text-sm mt-2 italic">
                              "{request.message}"
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleConnectionResponse(request._id, "declined")}
                          variant="outline"
                          className="border-red-500 text-red-500 hover:bg-red-500/10"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Decline
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleConnectionResponse(request._id, "accepted")}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Accept
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {connectionRequests.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No pending connection requests</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Feed Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
            <CardHeader>
              <CardTitle className="text-white">Activity Feed</CardTitle>
              <CardDescription className="text-gray-400">
                Latest activities from your network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity._id} className="p-4 bg-[#2a2a2a] rounded-lg border border-[#3f3f3f]">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-medium">{activity.user.fullName}</span>
                          <span className="text-gray-400 text-sm">{activity.title}</span>
                        </div>
                        <p className="text-gray-300 text-sm mb-2">{activity.description}</p>
                        {activity.relatedJob && (
                          <div className="p-2 bg-[#1a1a1a] rounded border border-[#3f3f3f] mb-2">
                            <p className="text-xs text-gray-400">Related Job:</p>
                            <p className="text-sm text-white">{activity.relatedJob.title} at {activity.relatedJob.companyName}</p>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            {new Date(activity.createdAt).toLocaleString()}
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Heart className="h-3 w-3" />
                              {activity.likes}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <MessageCircle className="h-3 w-3" />
                              {activity.comments}
                            </div>
                            <Button size="sm" variant="ghost" className="text-gray-500 hover:text-white">
                              <Share className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {activities.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No recent activities</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}