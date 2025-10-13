"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Plus,
  Search,
  Filter,
  Star,
  Share2
} from "lucide-react"

export default function EventsPage() {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Art Exhibition: Modern Masters",
      description: "Join us for an exclusive exhibition featuring contemporary artists from around the world.",
      date: "2025-10-15",
      time: "18:00",
      location: "Art Gallery Mumbai",
      city: "Mumbai",
      attendees: 150,
      maxAttendees: 200,
      price: "Free",
      category: "Exhibition",
      featured: true,
      organizer: "Mumbai Art Society"
    },
    {
      id: 2,
      title: "Music Workshop: Classical Instruments",
      description: "Learn traditional Indian classical music instruments from renowned musicians.",
      date: "2025-10-20",
      time: "14:00",
      location: "Cultural Center",
      city: "Delhi",
      attendees: 45,
      maxAttendees: 50,
      price: "₹500",
      category: "Workshop",
      featured: false,
      organizer: "Delhi Music Academy"
    },
    {
      id: 3,
      title: "Dance Performance: Bharatanatyam",
      description: "Experience the beauty of classical Indian dance with a special performance.",
      date: "2025-10-25",
      time: "19:30",
      location: "Theater Hall",
      city: "Bangalore",
      attendees: 80,
      maxAttendees: 100,
      price: "₹300",
      category: "Performance",
      featured: true,
      organizer: "Bangalore Dance Society"
    },
    {
      id: 4,
      title: "Photography Contest: Street Life",
      description: "Capture the essence of urban life in this photography competition.",
      date: "2025-11-01",
      time: "09:00",
      location: "City Center",
      city: "Pune",
      attendees: 25,
      maxAttendees: 100,
      price: "₹200",
      category: "Contest",
      featured: false,
      organizer: "Pune Photography Club"
    }
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const categories = ["All", "Exhibition", "Workshop", "Performance", "Contest", "Conference"]

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.city.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || event.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredEvents = events.filter(event => event.featured)

  return (
    <div className="container max-w-7xl py-6 text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Events</h1>
        <p className="text-gray-400">Discover and join amazing cultural events in your area</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#1f1f1f] border-[#2f2f2f] text-white"
            />
          </div>
          <div className="flex gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-primary" : "bg-[#1f1f1f] border-[#2f2f2f] text-white"}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Events */}
      {featuredEvents.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-400" />
            Featured Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredEvents.map(event => (
              <Card key={event.id} className="bg-[#1f1f1f] border-[#2f2f2f] hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white text-lg">{event.title}</CardTitle>
                      <CardDescription className="text-gray-400 mt-1">
                        {event.organizer}
                      </CardDescription>
                    </div>
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                      Featured
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4 line-clamp-2">{event.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="h-4 w-4" />
                      {new Date(event.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="h-4 w-4" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <MapPin className="h-4 w-4" />
                      {event.location}, {event.city}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Users className="h-4 w-4" />
                      {event.attendees}/{event.maxAttendees} attendees
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-primary/20 text-primary">
                        {event.category}
                      </Badge>
                      <span className="text-lg font-semibold text-white">{event.price}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-[#2f2f2f] text-white hover:bg-ink-hover">
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        Join Event
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* All Events */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">All Events</h2>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </div>

        {filteredEvents.length === 0 ? (
          <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-white mb-2">No events found</h3>
              <p className="text-gray-400">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map(event => (
              <Card key={event.id} className="bg-[#1f1f1f] border-[#2f2f2f] hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-white text-lg line-clamp-1">{event.title}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {event.organizer}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4 line-clamp-2">{event.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="h-4 w-4" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="h-4 w-4" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <MapPin className="h-4 w-4" />
                      {event.city}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Users className="h-4 w-4" />
                      {event.attendees}/{event.maxAttendees}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-primary/20 text-primary">
                        {event.category}
                      </Badge>
                      <span className="font-semibold text-white">{event.price}</span>
                    </div>
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      Join
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

