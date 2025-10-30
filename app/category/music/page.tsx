"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { searchUsers } from "@/lib/api"
import { 
  Music, 
  Mic, 
  Headphones, 
  Users, 
  Search, 
  MapPin, 
  Star,
  Eye,
  UserPlus,
  MessageCircle,
  Volume2,
  Radio
} from "lucide-react"

export default function MusicPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [filters, setFilters] = useState({
    role: "",
    genre: "",
    instrument: "",
    experience: "",
    location: ""
  })
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (searchQuery.length < 2) return
    
    setLoading(true)
    try {
      const response = await searchUsers({ 
        q: searchQuery,
        category: "music",
        ...filters
      })
      setSearchResults(response.users || [])
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setLoading(false)
    }
  }

  const musicCategories = [
    { name: "Vocalists", count: 67, icon: <Mic className="h-5 w-5" /> },
    { name: "Music Producers", count: 43, icon: <Headphones className="h-5 w-5" /> },
    { name: "Instrumentalists", count: 89, icon: <Music className="h-5 w-5" /> },
    { name: "Sound Engineers", count: 32, icon: <Volume2 className="h-5 w-5" /> },
    { name: "Music Directors", count: 28, icon: <Radio className="h-5 w-5" /> },
    { name: "Composers", count: 41, icon: <Music className="h-5 w-5" /> }
  ]

  return (
    <div className="container max-w-6xl py-6 text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Music className="h-8 w-8 text-primary" />
          Music Industry
        </h1>
        <p className="text-gray-400">Connect with musicians, producers, and music industry professionals</p>
      </div>

      {/* Music Categories */}
      <Card className="bg-[#1f1f1f] border-[#2f2f2f] mb-6">
        <CardHeader>
          <CardTitle className="text-white">Music Categories</CardTitle>
          <CardDescription className="text-gray-400">Explore different music industry roles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {musicCategories.map((category) => (
              <div key={category.name} className="p-4 bg-[#2a2a2a] rounded-lg border border-[#3f3f3f] hover:border-primary/50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      {category.icon}
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{category.name}</h4>
                      <p className="text-gray-400 text-sm">{category.count} professionals</p>
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
            Find Music Professionals
          </CardTitle>
          <CardDescription className="text-gray-400">Search by genre, instrument, and expertise</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, genre, or instrument..."
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
            
            {/* Music-Specific Filters */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <select 
                className="bg-[#2a2a2a] border-[#3f3f3f] text-white rounded px-3 py-2"
                value={filters.role}
                onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
              >
                <option value="">All Roles</option>
                <option value="vocalist">Vocalist</option>
                <option value="instrumentalist">Instrumentalist</option>
                <option value="producer">Producer</option>
                <option value="composer">Composer</option>
                <option value="sound-engineer">Sound Engineer</option>
              </select>
              
              <select 
                className="bg-[#2a2a2a] border-[#3f3f3f] text-white rounded px-3 py-2"
                value={filters.genre}
                onChange={(e) => setFilters(prev => ({ ...prev, genre: e.target.value }))}
              >
                <option value="">All Genres</option>
                <option value="classical">Classical</option>
                <option value="bollywood">Bollywood</option>
                <option value="rock">Rock</option>
                <option value="pop">Pop</option>
                <option value="jazz">Jazz</option>
                <option value="folk">Folk</option>
              </select>
              
              <select 
                className="bg-[#2a2a2a] border-[#3f3f3f] text-white rounded px-3 py-2"
                value={filters.instrument}
                onChange={(e) => setFilters(prev => ({ ...prev, instrument: e.target.value }))}
              >
                <option value="">Instruments</option>
                <option value="guitar">Guitar</option>
                <option value="piano">Piano</option>
                <option value="drums">Drums</option>
                <option value="violin">Violin</option>
                <option value="flute">Flute</option>
                <option value="tabla">Tabla</option>
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
                <option value="chennai">Chennai</option>
                <option value="bangalore">Bangalore</option>
                <option value="kolkata">Kolkata</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Featured Musicians */}
      <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
        <CardHeader>
          <CardTitle className="text-white">Featured Musicians</CardTitle>
          <CardDescription className="text-gray-400">Top-rated music industry professionals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Sample featured musicians */}
            <div className="p-4 bg-[#2a2a2a] rounded-lg border border-[#3f3f3f]">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder-user.jpg" alt="Rahul Mehta" />
                  <AvatarFallback className="bg-primary text-white">RM</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-white font-medium">Rahul Mehta</h4>
                  <p className="text-gray-400 text-sm">Music Producer</p>
                </div>
                <Badge className="bg-yellow-500/20 text-yellow-500 ml-auto">Featured</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Genre:</span>
                  <span className="text-white">Bollywood, Pop</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Experience:</span>
                  <span className="text-white">12 years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Location:</span>
                  <span className="text-white">Mumbai</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Studio:</span>
                  <span className="text-white">Yes</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90">
                  <UserPlus className="h-4 w-4 mr-1" />
                  Connect
                </Button>
                <Button size="sm" variant="outline" className="border-[#3f3f3f] text-white hover:bg-[#2a2a2a]">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="p-4 bg-[#2a2a2a] rounded-lg border border-[#3f3f3f]">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder-user.jpg" alt="Shreya Ghoshal" />
                  <AvatarFallback className="bg-primary text-white">SG</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-white font-medium">Shreya Iyer</h4>
                  <p className="text-gray-400 text-sm">Playback Singer</p>
                </div>
                <Badge className="bg-purple-500/20 text-purple-500 ml-auto">Top Rated</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Vocal Range:</span>
                  <span className="text-white">Soprano</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Experience:</span>
                  <span className="text-white">8 years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Location:</span>
                  <span className="text-white">Chennai</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Languages:</span>
                  <span className="text-white">Tamil, Hindi</span>
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
                  <AvatarImage src="/placeholder-user.jpg" alt="Amit Trivedi" />
                  <AvatarFallback className="bg-primary text-white">AT</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-white font-medium">Amit Kumar</h4>
                  <p className="text-gray-400 text-sm">Guitarist</p>
                </div>
                <Badge className="bg-green-500/20 text-green-500 ml-auto">Available</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Instruments:</span>
                  <span className="text-white">Guitar, Bass</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Experience:</span>
                  <span className="text-white">10 years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Location:</span>
                  <span className="text-white">Delhi</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Genre:</span>
                  <span className="text-white">Rock, Blues</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90">
                  <UserPlus className="h-4 w-4 mr-1" />
                  Connect
                </Button>
                <Button size="sm" variant="outline" className="border-[#3f3f3f] text-white hover:bg-[#2a2a2a]">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}