"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { searchUsers } from "@/lib/api"
import { 
  Palette, 
  Brush, 
  Image as ImageIcon, 
  Users, 
  Search, 
  MapPin, 
  Star,
  Eye,
  UserPlus,
  MessageCircle,
  Award
} from "lucide-react"

export default function PaintingPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [filters, setFilters] = useState({
    medium: "",
    style: "",
    experience: "",
    location: "",
    priceRange: ""
  })
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (searchQuery.length < 2) return
    
    setLoading(true)
    try {
      const response = await searchUsers({ 
        q: searchQuery,
        category: "painting",
        ...filters
      })
      setSearchResults(response.users || [])
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setLoading(false)
    }
  }

  const artCategories = [
    { name: "Portrait Artists", count: 34, icon: <Users className="h-5 w-5" /> },
    { name: "Landscape Artists", count: 28, icon: <ImageIcon className="h-5 w-5" /> },
    { name: "Abstract Artists", count: 42, icon: <Palette className="h-5 w-5" /> },
    { name: "Digital Artists", count: 56, icon: <ImageIcon className="h-5 w-5" /> },
    { name: "Muralists", count: 19, icon: <Brush className="h-5 w-5" /> },
    { name: "Illustrators", count: 38, icon: <Palette className="h-5 w-5" /> }
  ]

  return (
    <div className="container max-w-6xl py-6 text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Palette className="h-8 w-8 text-primary" />
          Painting & Visual Arts
        </h1>
        <p className="text-gray-400">Connect with painters, illustrators, and visual artists</p>
      </div>

      {/* Art Categories */}
      <Card className="bg-[#1f1f1f] border-[#2f2f2f] mb-6">
        <CardHeader>
          <CardTitle className="text-white">Art Categories</CardTitle>
          <CardDescription className="text-gray-400">Explore different types of visual artists</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {artCategories.map((category) => (
              <div key={category.name} className="p-4 bg-[#2a2a2a] rounded-lg border border-[#3f3f3f] hover:border-primary/50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      {category.icon}
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{category.name}</h4>
                      <p className="text-gray-400 text-sm">{category.count} artists</p>
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
            Find Visual Artists
          </CardTitle>
          <CardDescription className="text-gray-400">Search by medium, style, and expertise</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, style, or medium..."
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
            
            {/* Art-Specific Filters */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <select 
                className="bg-[#2a2a2a] border-[#3f3f3f] text-white rounded px-3 py-2"
                value={filters.medium}
                onChange={(e) => setFilters(prev => ({ ...prev, medium: e.target.value }))}
              >
                <option value="">All Mediums</option>
                <option value="oil">Oil Painting</option>
                <option value="watercolor">Watercolor</option>
                <option value="acrylic">Acrylic</option>
                <option value="digital">Digital Art</option>
                <option value="mixed-media">Mixed Media</option>
              </select>
              
              <select 
                className="bg-[#2a2a2a] border-[#3f3f3f] text-white rounded px-3 py-2"
                value={filters.style}
                onChange={(e) => setFilters(prev => ({ ...prev, style: e.target.value }))}
              >
                <option value="">All Styles</option>
                <option value="realistic">Realistic</option>
                <option value="abstract">Abstract</option>
                <option value="impressionist">Impressionist</option>
                <option value="contemporary">Contemporary</option>
                <option value="traditional">Traditional</option>
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
                <option value="pune">Pune</option>
              </select>
              
              <select 
                className="bg-[#2a2a2a] border-[#3f3f3f] text-white rounded px-3 py-2"
                value={filters.priceRange}
                onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
              >
                <option value="">Price Range</option>
                <option value="0-5000">₹0 - ₹5,000</option>
                <option value="5000-15000">₹5,000 - ₹15,000</option>
                <option value="15000-50000">₹15,000 - ₹50,000</option>
                <option value="50000+">₹50,000+</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Featured Artists */}
      <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
        <CardHeader>
          <CardTitle className="text-white">Featured Artists</CardTitle>
          <CardDescription className="text-gray-400">Top-rated painters and visual artists</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Sample featured artists */}
            <div className="p-4 bg-[#2a2a2a] rounded-lg border border-[#3f3f3f]">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder-user.jpg" alt="Maya Patel" />
                  <AvatarFallback className="bg-primary text-white">MP</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-white font-medium">Maya Patel</h4>
                  <p className="text-gray-400 text-sm">Portrait Artist</p>
                </div>
                <Badge className="bg-yellow-500/20 text-yellow-500 ml-auto">Featured</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Medium:</span>
                  <span className="text-white">Oil, Watercolor</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Experience:</span>
                  <span className="text-white">10 years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Location:</span>
                  <span className="text-white">Mumbai</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Rate:</span>
                  <span className="text-white">₹15,000/project</span>
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
                  <AvatarImage src="/placeholder-user.jpg" alt="Vikram Singh" />
                  <AvatarFallback className="bg-primary text-white">VS</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-white font-medium">Vikram Singh</h4>
                  <p className="text-gray-400 text-sm">Abstract Artist</p>
                </div>
                <Badge className="bg-purple-500/20 text-purple-500 ml-auto">Award Winner</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Medium:</span>
                  <span className="text-white">Acrylic, Mixed Media</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Experience:</span>
                  <span className="text-white">15 years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Location:</span>
                  <span className="text-white">Delhi</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Exhibitions:</span>
                  <span className="text-white">25+ shows</span>
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
                  <AvatarImage src="/placeholder-user.jpg" alt="Anita Desai" />
                  <AvatarFallback className="bg-primary text-white">AD</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-white font-medium">Anita Desai</h4>
                  <p className="text-gray-400 text-sm">Digital Artist</p>
                </div>
                <Badge className="bg-green-500/20 text-green-500 ml-auto">Available</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Medium:</span>
                  <span className="text-white">Digital, Photoshop</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Experience:</span>
                  <span className="text-white">7 years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Location:</span>
                  <span className="text-white">Bangalore</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Speciality:</span>
                  <span className="text-white">Concept Art</span>
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



