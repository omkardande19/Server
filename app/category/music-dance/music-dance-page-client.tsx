"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Filter,
  Music,
  Mic,
  Radio,
  Headphones,
  MapPin,
  Users,
  Calendar,
  Clock,
  Star,
  ExternalLink,
  Bookmark,
  Briefcase,
  Building2,
  DollarSign,
  Play,
  Pause,
  Volume2,
  Sparkles,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function MusicDancePageClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("all")
  const [isPlaying, setIsPlaying] = useState<{ [key: string]: boolean }>({})

  const categories = [
    { id: "music", name: "Music", icon: Music },
    { id: "dance", name: "Dance", icon: Sparkles },
  ]

  const subCategories = {
    music: [
      { id: "classical", name: "Classical", icon: Music },
      { id: "vocals", name: "Vocals", icon: Mic },
      { id: "instrumental", name: "Instrumental", icon: Radio },
      { id: "production", name: "Production", icon: Headphones },
    ],
    dance: [
      { id: "classical", name: "Classical Dance", icon: Sparkles },
      { id: "contemporary", name: "Contemporary", icon: Sparkles },
      { id: "folk", name: "Folk Dance", icon: Sparkles },
      { id: "choreography", name: "Choreography", icon: Sparkles },
    ],
  }

  const featuredArtists = [
    {
      id: 1,
      name: "Arun Kumar",
      image: "/placeholder.svg",
      coverImage: "/placeholder.svg",
      title: "Classical Vocalist",
      category: "music",
      location: "Mumbai, India",
      followers: 2345,
      isVerified: true,
      specialization: ["Hindustani Classical", "Semi Classical"],
      sampleTrack: "/placeholder.mp3",
    },
    {
      id: 2,
      name: "Meera Sharma",
      image: "/placeholder.svg",
      coverImage: "/placeholder.svg",
      title: "Bharatanatyam Dancer",
      category: "dance",
      location: "Chennai, India",
      followers: 1892,
      isVerified: true,
      specialization: ["Bharatanatyam", "Contemporary"],
      performanceVideo: "/placeholder.mp4",
    },
    {
      id: 3,
      name: "Priya Mehta",
      image: "/placeholder.svg",
      coverImage: "/placeholder.svg",
      title: "Music Producer & Dancer",
      category: "both",
      location: "Delhi, India",
      followers: 3156,
      isVerified: true,
      specialization: ["Electronic Music", "Contemporary Dance"],
      sampleTrack: "/placeholder.mp3",
    },
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: "Classical Music & Dance Festival",
      performers: ["Arun Kumar", "Meera Sharma"],
      image: "/placeholder.svg",
      date: "March 15, 2024",
      time: "7:00 PM",
      location: "National Auditorium, Mumbai",
      type: "Festival",
      price: "₹500 onwards",
      description: "An evening of classical music and dance performances",
      category: "both",
    },
    {
      id: 2,
      title: "Contemporary Dance Workshop",
      performers: ["Priya Mehta"],
      image: "/placeholder.svg",
      date: "April 5, 2024",
      time: "11:00 AM",
      location: "Dance Academy, Delhi",
      type: "Workshop",
      price: "₹2000",
      description: "Learn contemporary dance techniques with fusion music",
      category: "dance",
    },
  ]

  const opportunities = [
    {
      id: 1,
      title: "Music & Dance Teacher",
      company: "Performing Arts Academy",
      companyLogo: "/placeholder.svg",
      location: "Mumbai, India",
      type: "Full Time",
      category: "both",
      salary: "₹40,000 - ₹60,000 per month",
      posted: "2 days ago",
      deadline: "March 30, 2024",
    },
    {
      id: 2,
      title: "Choreographer",
      company: "Dance Company",
      companyLogo: "/placeholder.svg",
      location: "Bangalore, India",
      type: "Full Time",
      category: "dance",
      salary: "₹45,000 - ₹65,000 per month",
      posted: "1 week ago",
      deadline: "April 15, 2024",
    },
  ]

  const togglePlay = (id: string) => {
    setIsPlaying((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const filteredArtists =
    selectedCategory === "all"
      ? featuredArtists
      : featuredArtists.filter((artist) => artist.category === selectedCategory || artist.category === "both")

  const filteredEvents =
    selectedCategory === "all"
      ? upcomingEvents
      : upcomingEvents.filter((event) => event.category === selectedCategory || event.category === "both")

  const filteredOpportunities =
    selectedCategory === "all"
      ? opportunities
      : opportunities.filter((job) => job.category === selectedCategory || job.category === "both")

  return (
    <div className="container max-w-7xl py-6 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <Music className="h-8 w-8 text-primary" />
          <span className="text-primary">/</span>
          <Sparkles className="h-8 w-8 text-primary" />
          Music & Dance
        </h1>
        <p className="text-muted-foreground">
          Discover talented musicians and dancers, upcoming performances, and opportunities in performing arts
        </p>
      </div>

      {/* Category Selection */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          variant={selectedCategory === "all" ? "default" : "outline"}
          className="border-ink text-white hover:bg-ink-hover"
          onClick={() => setSelectedCategory("all")}
        >
          All Categories
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            className="border-ink text-white hover:bg-ink-hover"
            onClick={() => setSelectedCategory(category.id)}
          >
            <category.icon className="mr-2 h-4 w-4" />
            {category.name}
          </Button>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search artists, events..." className="pl-10 bg-ink-light border-ink text-white" />
        </div>
        <Select onValueChange={setSelectedSubCategory} defaultValue="all">
          <SelectTrigger className="bg-ink-light border-ink text-white">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by specialty" />
          </SelectTrigger>
          <SelectContent className="bg-ink-light border-ink">
            <SelectItem value="all">All Specialties</SelectItem>
            {selectedCategory !== "all" &&
              subCategories[selectedCategory as keyof typeof subCategories].map((subCategory) => (
                <SelectItem key={subCategory.id} value={subCategory.id}>
                  {subCategory.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <Select defaultValue="trending">
          <SelectTrigger className="bg-ink-light border-ink text-white">
            <Star className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-ink-light border-ink">
            <SelectItem value="trending">Trending</SelectItem>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="artists" className="space-y-6">
        <TabsList className="bg-ink-light border-ink h-12">
          <TabsTrigger value="artists" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <Users className="h-4 w-4 mr-2" />
            Artists
          </TabsTrigger>
          <TabsTrigger value="events" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <Calendar className="h-4 w-4 mr-2" />
            Events
          </TabsTrigger>
          <TabsTrigger value="opportunities" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <Briefcase className="h-4 w-4 mr-2" />
            Opportunities
          </TabsTrigger>
        </TabsList>

        {/* Artists Tab */}
        <TabsContent value="artists" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredArtists.map((artist) => (
              <Card key={artist.id} className="overflow-hidden bg-ink-light border-ink">
                <div className="relative h-32">
                  <Image src={artist.coverImage || "/placeholder.svg"} alt="" fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                </div>
                <div className="p-6 relative -mt-16">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <Image
                        src={artist.image || "/placeholder.svg"}
                        alt={artist.name}
                        width={80}
                        height={80}
                        className="rounded-lg border-4 border-ink-light"
                      />
                      {artist.isVerified && (
                        <div className="absolute -right-2 -bottom-2">
                          <Star className="h-6 w-6 text-primary fill-primary" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link
                            href={`/profile/${artist.id}`}
                            className="text-xl font-semibold text-white hover:text-primary"
                          >
                            {artist.name}
                          </Link>
                          <p className="text-primary">{artist.title}</p>
                        </div>
                        <Button variant="outline" size="sm" className="border-ink text-white hover:bg-ink-hover">
                          Follow
                        </Button>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <MapPin className="mr-1 h-4 w-4" />
                          {artist.location}
                        </div>
                        <div className="flex items-center">
                          <Users className="mr-1 h-4 w-4" />
                          {artist.followers.toLocaleString()} followers
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {artist.specialization.map((spec, index) => (
                          <Badge key={index} variant="outline" className="border-primary/20 text-primary">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                      {artist.sampleTrack && (
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-ink">
                          <Button
                            variant="outline"
                            size="icon"
                            className="border-ink text-white hover:bg-ink-hover"
                            onClick={() => togglePlay(artist.id.toString())}
                          >
                            {isPlaying[artist.id] ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                          <div className="flex-1 h-1 bg-ink-hover rounded-full overflow-hidden">
                            <div className="h-full w-1/3 bg-primary rounded-full" />
                          </div>
                          <Volume2 className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden bg-ink-light border-ink">
                <div className="md:flex">
                  <div className="relative h-48 md:h-auto md:w-72">
                    <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                  </div>
                  <div className="p-6 flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-white">{event.title}</h3>
                        <p className="text-primary">{event.performers.join(" • ")}</p>
                      </div>
                      <Badge variant="outline" className="border-primary/20 text-primary">
                        {event.type}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{event.description}</p>
                    <div className="flex flex-col gap-2 mt-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        {event.date} at {event.time}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4" />
                        {event.location}
                      </div>
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                      <p className="text-sm font-medium text-white">{event.price}</p>
                      <Button className="bg-primary hover:bg-primary/90">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Book Tickets
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Opportunities Tab */}
        <TabsContent value="opportunities" className="space-y-6">
          <div className="space-y-4">
            {filteredOpportunities.map((job) => (
              <Card key={job.id} className="p-6 bg-ink-light border-ink hover:border-primary/50 transition-colors">
                <div className="flex items-start gap-4">
                  <Image
                    src={job.companyLogo || "/placeholder.svg"}
                    alt={job.company}
                    width={56}
                    height={56}
                    className="rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link
                          href={`/opportunities/${job.id}`}
                          className="text-lg font-semibold text-white hover:text-primary"
                        >
                          {job.title}
                        </Link>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Building2 className="h-4 w-4" />
                          {job.company}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline" className="border-primary/20 text-primary">
                        {job.type}
                      </Badge>
                      <Badge variant="outline" className="border-ink text-white">
                        <MapPin className="mr-1 h-3 w-3" />
                        {job.location}
                      </Badge>
                      <Badge variant="outline" className="border-ink text-white">
                        <DollarSign className="mr-1 h-3 w-3" />
                        {job.salary}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-ink">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-4 w-4" />
                        Posted {job.posted}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-1 h-4 w-4" />
                        Deadline: {job.deadline}
                      </div>
                      <div className="ml-auto">
                        <Button className="bg-primary hover:bg-primary/90">Apply Now</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

