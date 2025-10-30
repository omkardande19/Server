"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { searchUsers } from "@/lib/api"
import { 
  Film, 
  Camera, 
  Mic, 
  Users, 
  Search, 
  MapPin, 
  Star,
  Eye,
  UserPlus,
  MessageCircle,
  Filter
} from "lucide-react"

export default function ActingFilmPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [filters, setFilters] = useState({
    role: "",
    experience: "",
    location: "",
    ageRange: "",
    languages: ""
  })
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (searchQuery.length < 2) return
    
    setLoading(true)
    try {
      const response = await searchUsers({ 
        q: searchQuery,
        category: "acting-film",
        ...filters
      })
      setSearchResults(response.users || [])
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setLoading(false)
    }
  }

  const actingRoles = [
    { name: "Lead Actor", count: 45, icon: <Star className="h-5 w-5" /> },
    { name: "Supporting Actor", count: 78, icon: <Users className="h-5 w-5" /> },
    { name: "Director", count: 23, icon: <Film className="h-5 w-5" /> },
    { name: "Cinematographer", count: 34, icon: <Camera className="h-5 w-5" /> },
    { name: "Sound Engineer", count: 19, icon: <Mic className="h-5 w-5" /> },
    { name: "Film Editor", count: 28, icon: <Film className="h-5 w-5" /> }
  ]

  return (
    <div className="container max-w-6xl py-6 text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Film className="h-8 w-8 text-primary" />
          Acting & Film Industry
        </h1>
        <p className="text-gray-400">Connect with actors, directors, and film industry professionals</p>
      </div>

      {/* Popular Roles */}
      <Card className="bg-[#1f1f1f] border-[#2f2f2f] mb-6">
        <CardHeader>
          <CardTitle className="text-white">Popular Roles</CardTitle>
          <CardDescription className="text-gray-400">Most in-demand positions in acting & film</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {actingRoles.map((role) => (
              <div key={role.name} className="p-4 bg-[#2a2a2a] rounded-lg border border-[#3f3f3f] hover:border-primary/50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      {role.icon}
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{role.name}</h4>
                      <p className="text-gray-400 text-sm">{role.count} professionals</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="border-[#3f3f3f] text-white hover:bg-[#2a2a2a]">
                    View All
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Advanced Search */}
      <Card className="bg-[#1f1f1f] border-[#2f2f2f] mb-6">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Search className="h-5 w-5" />
            Find Acting & Film Professionals
          </CardTitle>
          <CardDescription className="text-gray-400">Search with specific criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or skills..."
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
            
            {/* Acting-Specific Filters */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <select 
                className="bg-[#2a2a2a] border-[#3f3f3f] text-white rounded px-3 py-2"
                value={filters.role}
                onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
              >
                <option value="">All Roles</option>
                <option value="lead-actor">Lead Actor</option>
                <option value="supporting-actor">Supporting Actor</option>
                <option value="character-actor">Character Actor</option>
                <option value="voice-actor">Voice Actor</option>
                <option value="stunt-performer">Stunt Performer</option>
              </select>
              
              <select 
                className="bg-[#2a2a2a] border-[#3f3f3f] text-white rounded px-3 py-2"
                value={filters.ageRange}
                onChange={(e) => setFilters(prev => ({ ...prev, ageRange: e.target.value }))}
              >
                <option value="">Age Range</option>
                <option value="18-25">18-25</option>
                <option value="26-35">26-35</option>
                <option value="36-45">36-45</option>
                <option value="46-55">46-55</option>
                <option value="55+">55+</option>
              </select>
              
              <select 
                className="bg-[#2a2a2a] border-[#3f3f3f] text-white rounded px-3 py-2"
                value={filters.experience}
                onChange={(e) => setFilters(prev => ({ ...prev, experience: e.target.value }))}
              >
                <option value="">Experience</option>
                <option value="0-2">0-2 years</option>
                <option value="3-5">3-5 years</option>
                <option value="6-10">6-10 years</option>
                <option value="10+">10+ years</option>
              </select>
              
              <select 
                className="bg-[#2a2a2a] border-[#3f3f3f] text-white rounded px-3 py-2"
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              >
                <option value="">Location</option>
                <option value="mumbai">Mumbai</option>
                <option value="delhi">Delhi</option>
                <option value="bangalore">Bangalore</option>
                <option value="chennai">Chennai</option>
                <option value="hyderabad">Hyderabad</option>
              </select>
              
              <select 
                className="bg-[#2a2a2a] border-[#3f3f3f] text-white rounded px-3 py-2"
                value={filters.languages}
                onChange={(e) => setFilters(prev => ({ ...prev, languages: e.target.value }))}
              >
                <option value="">Languages</option>
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
                <option value="tamil">Tamil</option>
                <option value="telugu">Telugu</option>
                <option value="malayalam">Malayalam</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
          <CardHeader>
            <CardTitle className="text-white">Search Results ({searchResults.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.map((person) => (
                <div key={person._id} className="p-4 bg-[#2a2a2a] rounded-lg border border-[#3f3f3f]">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={person.profileImage || "/placeholder-user.jpg"} alt={person.fullName} />
                      <AvatarFallback className="bg-primary text-white text-lg">
                        {person.fullName?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold">{person.fullName}</h4>
                      <p className="text-gray-400 text-sm">{person.userCategory} • {person.userCategoryType}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <MapPin className="h-3 w-3" />
                        {person.city}, {person.country}
                      </div>
                      
                      {/* Acting-specific info */}
                      {person.height && person.weight && (
                        <div className="flex items-center gap-4 text-xs text-gray-400 mt-2">
                          <span>Height: {person.height}</span>
                          <span>Weight: {person.weight}</span>
                        </div>
                      )}
                      
                      {person.languages && person.languages.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {person.languages.slice(0, 3).map((lang, idx) => (
                            <Badge key={idx} variant="outline" className="border-primary/30 text-primary text-xs">
                              {lang}
                            </Badge>
                          ))}
                          {person.languages.length > 3 && (
                            <Badge variant="outline" className="border-gray-500 text-gray-400 text-xs">
                              +{person.languages.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      {person.specialSkills && person.specialSkills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {person.specialSkills.slice(0, 2).map((skill, idx) => (
                            <Badge key={idx} variant="outline" className="border-green-500/30 text-green-400 text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        <UserPlus className="h-4 w-4 mr-1" />
                        Connect
                      </Button>
                      <Button size="sm" variant="outline" className="border-[#3f3f3f] text-white hover:bg-[#2a2a2a]">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Featured Professionals */}
      <Card className="bg-[#1f1f1f] border-[#2f2f2f] mt-6">
        <CardHeader>
          <CardTitle className="text-white">Featured Professionals</CardTitle>
          <CardDescription className="text-gray-400">Top-rated acting & film professionals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Sample featured professionals */}
            <div className="p-4 bg-[#2a2a2a] rounded-lg border border-[#3f3f3f]">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder-user.jpg" alt="Rajesh Kumar" />
                  <AvatarFallback className="bg-primary text-white">RK</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-white font-medium">Rajesh Kumar</h4>
                  <p className="text-gray-400 text-sm">Lead Actor</p>
                </div>
                <Badge className="bg-yellow-500/20 text-yellow-500 ml-auto">Featured</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Experience:</span>
                  <span className="text-white">8 years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Location:</span>
                  <span className="text-white">Mumbai</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Languages:</span>
                  <span className="text-white">Hindi, English</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90">
                  <UserPlus className="h-4 w-4 mr-1" />
                  Connect
                </Button>
                <Button size="sm" variant="outline" className="border-[#3f3f3f] text-white hover:bg-[#2a2a2a]">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="p-4 bg-[#2a2a2a] rounded-lg border border-[#3f3f3f]">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder-user.jpg" alt="Priya Sharma" />
                  <AvatarFallback className="bg-primary text-white">PS</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-white font-medium">Priya Sharma</h4>
                  <p className="text-gray-400 text-sm">Director</p>
                </div>
                <Badge className="bg-blue-500/20 text-blue-500 ml-auto">Top Rated</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Experience:</span>
                  <span className="text-white">12 years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Location:</span>
                  <span className="text-white">Delhi</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Specialization:</span>
                  <span className="text-white">Drama, Thriller</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90">
                  <UserPlus className="h-4 w-4 mr-1" />
                  Connect
                </Button>
                <Button size="sm" variant="outline" className="border-[#3f3f3f] text-white hover:bg-[#2a2a2a]">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="p-4 bg-[#2a2a2a] rounded-lg border border-[#3f3f3f]">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder-user.jpg" alt="Arjun Reddy" />
                  <AvatarFallback className="bg-primary text-white">AR</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-white font-medium">Arjun Reddy</h4>
                  <p className="text-gray-400 text-sm">Cinematographer</p>
                </div>
                <Badge className="bg-green-500/20 text-green-500 ml-auto">Available</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Experience:</span>
                  <span className="text-white">6 years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Location:</span>
                  <span className="text-white">Bangalore</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Equipment:</span>
                  <span className="text-white">RED, Canon</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90">
                  <UserPlus className="h-4 w-4 mr-1" />
                  Connect
                </Button>
                <Button size="sm" variant="outline" className="border-[#3f3f3f] text-white hover:bg-[#2a2a2a]">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

