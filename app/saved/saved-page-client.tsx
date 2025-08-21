"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Briefcase,
  Users,
  Calendar,
  MapPin,
  Building2,
  Clock,
  DollarSign,
  Trash2,
  Share2,
  ExternalLink,
  Star,
  Bookmark,
} from "lucide-react"

export default function SavedPageClient() {
  const [selectedTab, setSelectedTab] = useState("jobs")

  const savedJobs = [
    {
      id: 1,
      title: "Senior Visual Artist",
      company: "Creative Studios",
      companyLogo: "/placeholder.svg",
      location: "Mumbai, India",
      type: "Full Time",
      salary: "₹8L - ₹12L per year",
      posted: "2 days ago",
      deadline: "March 30, 2024",
      description: "We're looking for a senior visual artist to join our creative team...",
      savedAt: "2024-02-20T10:30:00Z",
    },
    {
      id: 2,
      title: "Music Producer",
      company: "Harmony Records",
      companyLogo: "/placeholder.svg",
      location: "Delhi, India",
      type: "Contract",
      salary: "₹5000 - ₹8000 per day",
      posted: "1 week ago",
      deadline: "April 15, 2024",
      description: "Seeking an experienced music producer for upcoming album projects...",
      savedAt: "2024-02-19T15:45:00Z",
    },
  ]

  const savedArtists = [
    {
      id: 1,
      name: "Priya Sharma",
      title: "Classical Dancer",
      image: "/placeholder.svg",
      coverImage: "/placeholder.svg",
      location: "Mumbai, India",
      followers: 1234,
      isVerified: true,
      about: "Award-winning classical dancer specializing in Bharatanatyam and contemporary fusion.",
      savedAt: "2024-02-20T09:15:00Z",
    },
    {
      id: 2,
      name: "Rahul Mehta",
      title: "Music Composer",
      image: "/placeholder.svg",
      coverImage: "/placeholder.svg",
      location: "Delhi, India",
      followers: 892,
      isVerified: true,
      about: "Composing music that bridges classical and contemporary styles.",
      savedAt: "2024-02-18T14:20:00Z",
    },
  ]

  const savedEvents = [
    {
      id: 1,
      title: "Contemporary Art Exhibition",
      organizer: "National Gallery",
      image: "/placeholder.svg",
      date: "March 15-20, 2024",
      location: "Mumbai, India",
      type: "Exhibition",
      price: "Free Entry",
      description: "Featuring works from emerging contemporary artists across India.",
      savedAt: "2024-02-21T11:30:00Z",
    },
    {
      id: 2,
      title: "Classical Music Festival",
      organizer: "Music Academy",
      image: "/placeholder.svg",
      date: "April 5-7, 2024",
      location: "Delhi, India",
      type: "Festival",
      price: "₹500 onwards",
      description: "Three days of classical music performances by renowned artists.",
      savedAt: "2024-02-20T16:45:00Z",
    },
  ]

  const handleRemove = (type: string, id: number) => {
    // Implement remove functionality
    console.log(`Removing ${type} with id: ${id}`)
  }

  return (
    <div className="container max-w-7xl py-6 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-white">Saved Items</h1>
        <p className="text-muted-foreground">Access your bookmarked jobs, artists, and events</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="jobs" className="space-y-6">
        <TabsList className="bg-ink-light border-ink h-12">
          <TabsTrigger value="jobs" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <Briefcase className="h-4 w-4 mr-2" />
            Saved Jobs
            <Badge variant="outline" className="ml-2 bg-ink-hover border-ink">
              {savedJobs.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="artists" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <Users className="h-4 w-4 mr-2" />
            Saved Artists
            <Badge variant="outline" className="ml-2 bg-ink-hover border-ink">
              {savedArtists.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="events" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <Calendar className="h-4 w-4 mr-2" />
            Saved Events
            <Badge variant="outline" className="ml-2 bg-ink-hover border-ink">
              {savedEvents.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* Jobs Tab */}
        <TabsContent value="jobs" className="space-y-4">
          {savedJobs.map((job) => (
            <Card key={job.id} className="p-6 bg-ink-light border-ink hover:border-primary/50 transition-colors">
              <div className="flex items-start gap-4">
                <Image
                  src={job.companyLogo || "/placeholder.svg"}
                  alt={job.company}
                  width={56}
                  height={56}
                  className="rounded-lg"
                />
                <div className="flex-1 space-y-1">
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
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemove("job", job.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
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
                  <p className="mt-3 text-muted-foreground">{job.description}</p>
                  <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-ink">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" />
                      Posted {job.posted}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-1 h-4 w-4" />
                      Deadline: {job.deadline}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Bookmark className="mr-1 h-4 w-4" />
                      Saved {new Date(job.savedAt).toLocaleDateString()}
                    </div>
                    <div className="ml-auto">
                      <Button className="bg-primary hover:bg-primary/90">Apply Now</Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        {/* Artists Tab */}
        <TabsContent value="artists" className="space-y-4">
          {savedArtists.map((artist) => (
            <Card
              key={artist.id}
              className="overflow-hidden bg-ink-light border-ink hover:border-primary/50 transition-colors"
            >
              <div className="relative h-48">
                <Image
                  src={artist.coverImage || "/placeholder.svg"}
                  alt={`${artist.name}'s cover`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              </div>
              <div className="p-6 relative -mt-20">
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
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => handleRemove("artist", artist.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
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
                    <p className="mt-3 text-muted-foreground">{artist.about}</p>
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-ink">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Bookmark className="mr-1 h-4 w-4" />
                        Saved {new Date(artist.savedAt).toLocaleDateString()}
                      </div>
                      <div className="ml-auto">
                        <Button className="bg-primary hover:bg-primary/90">View Profile</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-4">
          {savedEvents.map((event) => (
            <Card
              key={event.id}
              className="overflow-hidden bg-ink-light border-ink hover:border-primary/50 transition-colors"
            >
              <div className="md:flex">
                <div className="relative h-48 md:h-auto md:w-72">
                  <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                </div>
                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link
                        href={`/events/${event.id}`}
                        className="text-xl font-semibold text-white hover:text-primary"
                      >
                        {event.title}
                      </Link>
                      <p className="text-primary">{event.organizer}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemove("event", event.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline" className="border-primary/20 text-primary">
                      {event.type}
                    </Badge>
                    <Badge variant="outline" className="border-ink text-white">
                      <MapPin className="mr-1 h-3 w-3" />
                      {event.location}
                    </Badge>
                    <Badge variant="outline" className="border-ink text-white">
                      <DollarSign className="mr-1 h-3 w-3" />
                      {event.price}
                    </Badge>
                  </div>
                  <p className="mt-3 text-muted-foreground">{event.description}</p>
                  <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-ink">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-1 h-4 w-4" />
                      {event.date}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Bookmark className="mr-1 h-4 w-4" />
                      Saved {new Date(event.savedAt).toLocaleDateString()}
                    </div>
                    <div className="ml-auto">
                      <Button className="bg-primary hover:bg-primary/90">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Get Tickets
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

