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
  Palette,
  Brush,
  Pencil,
  Camera,
  Layers,
  ThumbsUp,
  MessageCircle,
  Share2,
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
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function VisualArtsPageClient() {
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("all")

  const subCategories = [
    { id: "painting", name: "Painting", icon: Brush },
    { id: "digital", name: "Digital Art", icon: Layers },
    { id: "drawing", name: "Drawing", icon: Pencil },
    { id: "photography", name: "Photography", icon: Camera },
    { id: "mixed-media", name: "Mixed Media", icon: Palette },
  ]

  const featuredArtworks = [
    {
      id: 1,
      title: "Urban Reflections",
      artist: "Priya Sharma",
      artistImage: "/placeholder.svg",
      image: "/placeholder.svg",
      category: "painting",
      medium: "Acrylic on Canvas",
      likes: 234,
      comments: 45,
      isVerified: true,
    },
    {
      id: 2,
      title: "Digital Dreams",
      artist: "Rahul Mehta",
      artistImage: "/placeholder.svg",
      image: "/placeholder.svg",
      category: "digital",
      medium: "Digital Illustration",
      likes: 189,
      comments: 32,
      isVerified: true,
    },
    // Add more artworks...
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: "Contemporary Art Exhibition",
      organizer: "National Gallery",
      image: "/placeholder.svg",
      date: "March 15-20, 2024",
      location: "Mumbai, India",
      type: "Exhibition",
      price: "Free Entry",
    },
    {
      id: 2,
      title: "Digital Art Workshop",
      organizer: "Creative Studios",
      image: "/placeholder.svg",
      date: "April 5, 2024",
      location: "Delhi, India",
      type: "Workshop",
      price: "₹1000",
    },
    // Add more events...
  ]

  const opportunities = [
    {
      id: 1,
      title: "Senior Visual Artist",
      company: "Creative Studios",
      companyLogo: "/placeholder.svg",
      location: "Mumbai, India",
      type: "Full Time",
      category: "digital",
      salary: "₹8L - ₹12L per year",
      posted: "2 days ago",
      deadline: "March 30, 2024",
    },
    {
      id: 2,
      title: "Art Gallery Curator",
      company: "National Art Gallery",
      companyLogo: "/placeholder.svg",
      location: "Delhi, India",
      type: "Full Time",
      category: "curator",
      salary: "₹6L - ₹9L per year",
      posted: "1 week ago",
      deadline: "April 15, 2024",
    },
    // Add more opportunities...
  ]

  const featuredArtists = [
    {
      id: 1,
      name: "Priya Sharma",
      image: "/placeholder.svg",
      coverImage: "/placeholder.svg",
      title: "Contemporary Artist",
      location: "Mumbai, India",
      followers: 1234,
      isVerified: true,
      specialization: ["Painting", "Mixed Media"],
    },
    {
      id: 2,
      name: "Rahul Mehta",
      image: "/placeholder.svg",
      coverImage: "/placeholder.svg",
      title: "Digital Artist",
      location: "Delhi, India",
      followers: 892,
      isVerified: true,
      specialization: ["Digital Art", "Illustration"],
    },
    // Add more artists...
  ]

  return (
    <div className="container max-w-7xl py-6 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <Palette className="h-8 w-8 text-primary" />
          Visual Arts
        </h1>
        <p className="text-muted-foreground">
          Discover paintings, digital art, photography, and more from talented visual artists
        </p>
      </div>

      {/* Search and Filters */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search artworks, artists..." className="pl-10 bg-ink-light border-ink text-white" />
        </div>
        <Select onValueChange={setSelectedSubCategory} defaultValue="all">
          <SelectTrigger className="bg-ink-light border-ink text-white">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent className="bg-ink-light border-ink">
            <SelectItem value="all">All Categories</SelectItem>
            {subCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
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
      <Tabs defaultValue="artworks" className="space-y-6">
        <TabsList className="bg-ink-light border-ink h-12">
          <TabsTrigger value="artworks" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <Palette className="h-4 w-4 mr-2" />
            Artworks
          </TabsTrigger>
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

        {/* Artworks Tab */}
        <TabsContent value="artworks" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredArtworks.map((artwork) => (
              <Card key={artwork.id} className="overflow-hidden bg-ink-light border-ink">
                <div className="aspect-square relative">
                  <Image
                    src={artwork.image || "/placeholder.svg"}
                    alt={artwork.title}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Image
                        src={artwork.artistImage || "/placeholder.svg"}
                        alt={artwork.artist}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <div>
                        <Link
                          href={`/profile/${artwork.id}`}
                          className="text-sm font-medium text-white hover:text-primary"
                        >
                          {artwork.artist}
                        </Link>
                        {artwork.isVerified && (
                          <svg className="h-4 w-4 text-primary inline ml-1" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                  <h3 className="font-medium text-white mb-1">{artwork.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{artwork.medium}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {artwork.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {artwork.comments}
                      </Button>
                    </div>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Artists Tab */}
        <TabsContent value="artists" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredArtists.map((artist) => (
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
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden bg-ink-light border-ink">
                <div className="md:flex">
                  <div className="relative h-48 md:h-auto md:w-72">
                    <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                  </div>
                  <div className="p-6 flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-white">{event.title}</h3>
                        <p className="text-primary">{event.organizer}</p>
                      </div>
                      <Badge variant="outline" className="border-primary/20 text-primary">
                        {event.type}
                      </Badge>
                    </div>
                    <div className="flex flex-col gap-2 mt-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        {event.date}
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
                        Register
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
            {opportunities.map((job) => (
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

