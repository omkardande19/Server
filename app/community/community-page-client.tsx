"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Users, TrendingUp, Filter, Music, Palette, Camera, Mic, PenTool } from "lucide-react"

export default function CommunityPageClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedLocation, setSelectedLocation] = useState<string>("all")

  const categories = [
    { id: "visual", name: "Visual Arts", icon: Palette },
    { id: "music", name: "Music", icon: Music },
    { id: "photography", name: "Photography", icon: Camera },
    { id: "performing", name: "Performing Arts", icon: Mic },
    { id: "writing", name: "Writing", icon: PenTool },
  ]

  const artists = [
    {
      id: 1,
      name: "Sarah Johnson",
      title: "Visual Artist",
      location: "Mumbai, India",
      image: "/placeholder.svg",
      category: "visual",
      followers: 1234,
      isVerified: true,
      featured: true,
      about: "Contemporary artist specializing in abstract expressionism and mixed media.",
      recentWork: "/placeholder.svg",
    },
    {
      id: 2,
      name: "Rahul Mehta",
      title: "Classical Musician",
      location: "Delhi, India",
      image: "/placeholder.svg",
      category: "music",
      followers: 892,
      isVerified: true,
      featured: true,
      about: "Sitar player blending traditional Indian classical music with contemporary elements.",
      recentWork: "/placeholder.svg",
    },
    {
      id: 3,
      name: "Priya Patel",
      title: "Photographer",
      location: "Bangalore, India",
      image: "/placeholder.svg",
      category: "photography",
      followers: 567,
      featured: false,
      about: "Documentary and street photographer capturing urban life and culture.",
      recentWork: "/placeholder.svg",
    },
    // Add more artists as needed
  ]

  const trendingTopics = [
    {
      id: 1,
      title: "Digital Art Revolution",
      posts: 234,
      category: "visual",
    },
    {
      id: 2,
      title: "Classical Fusion Movement",
      posts: 189,
      category: "music",
    },
    {
      id: 3,
      title: "Street Photography Tips",
      posts: 156,
      category: "photography",
    },
  ]

  const featuredEvents = [
    {
      id: 1,
      title: "Contemporary Art Exhibition",
      date: "March 15-20, 2024",
      location: "National Gallery, Mumbai",
      image: "/placeholder.svg",
    },
    {
      id: 2,
      title: "Music Festival 2024",
      date: "April 5-7, 2024",
      location: "Cultural Center, Delhi",
      image: "/placeholder.svg",
    },
  ]

  const filteredArtists = artists.filter((artist) => {
    if (selectedCategory !== "all" && artist.category !== selectedCategory) {
      return false
    }
    return true
  })

  return (
    <div className="container max-w-7xl py-6 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-white">Artist Community</h1>
        <p className="text-muted-foreground">
          Connect with talented artists, musicians, photographers, and creative professionals.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search artists..." className="pl-10 bg-ink-light border-ink text-white" />
        </div>
        <Select onValueChange={setSelectedCategory} defaultValue="all">
          <SelectTrigger className="bg-ink-light border-ink text-white">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent className="bg-ink-light border-ink">
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={setSelectedLocation} defaultValue="all">
          <SelectTrigger className="bg-ink-light border-ink text-white">
            <MapPin className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by location" />
          </SelectTrigger>
          <SelectContent className="bg-ink-light border-ink">
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="mumbai">Mumbai</SelectItem>
            <SelectItem value="delhi">Delhi</SelectItem>
            <SelectItem value="bangalore">Bangalore</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Artists Grid */}
        <div className="lg:col-span-2 space-y-6">
          {/* Category Quick Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
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

          {/* Artists List */}
          <div className="grid gap-6 sm:grid-cols-2">
            {filteredArtists.map((artist) => (
              <Card key={artist.id} className="bg-ink-light border-ink overflow-hidden">
                <div className="relative h-32">
                  <Image
                    src={artist.recentWork || "/placeholder.svg"}
                    alt={`${artist.name}'s work`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Image
                          src={artist.image || "/placeholder.svg"}
                          alt={artist.name}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                        {artist.isVerified && (
                          <svg
                            className="h-5 w-5 text-primary absolute -right-1 -bottom-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <div>
                        <Link href={`/profile/${artist.id}`} className="font-semibold text-white hover:text-primary">
                          {artist.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">{artist.title}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="border-ink text-white hover:bg-ink-hover">
                      Follow
                    </Button>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{artist.about}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-1 h-4 w-4" />
                      {artist.location}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="mr-1 h-4 w-4" />
                      {artist.followers.toLocaleString()} followers
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Trending Topics */}
          <Card className="p-4 bg-ink-light border-ink">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Trending Topics
            </h2>
            <div className="space-y-4">
              {trendingTopics.map((topic) => (
                <div key={topic.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">{topic.title}</p>
                    <p className="text-sm text-muted-foreground">{topic.posts} posts</p>
                  </div>
                  <Badge variant="outline" className="border-primary/20 text-primary">
                    {categories.find((c) => c.id === topic.category)?.name}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Featured Events */}
          <Card className="p-4 bg-ink-light border-ink">
            <h2 className="text-lg font-semibold text-white mb-4">Featured Events</h2>
            <div className="space-y-4">
              {featuredEvents.map((event) => (
                <div key={event.id} className="group relative overflow-hidden rounded-lg">
                  <div className="aspect-video relative">
                    <Image
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-medium text-white">{event.title}</h3>
                      <p className="text-sm text-white/80">{event.date}</p>
                      <p className="text-sm text-white/60">{event.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

