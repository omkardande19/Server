"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Theater, Music, Sparkles, Ticket, MapPin, Users, Calendar, Play } from "lucide-react"

export default function PerformingArtsPageClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("all")
  const [isPlaying, setIsPlaying] = useState<{ [key: string]: boolean }>({})

  const categories = [
    { id: "theatre", name: "Theatre", icon: Theater },
    { id: "dance", name: "Dance", icon: Sparkles },
    { id: "music", name: "Music", icon: Music },
    { id: "circus", name: "Circus Arts", icon: Ticket },
  ]

  const subCategories = {
    theatre: ["Classical", "Contemporary", "Musical Theatre", "Street Theatre"],
    dance: ["Classical", "Contemporary", "Folk", "Ballet"],
    music: ["Classical", "Contemporary", "Folk", "Fusion"],
    circus: ["Acrobatics", "Aerial Arts", "Juggling", "Magic"],
  }

  const featuredArtists = [
    {
      id: "sarah-dance-1",
      name: "Sarah Johnson",
      profession: "Contemporary Dancer",
      location: "New York, NY",
      image: "/placeholder.svg?height=400&width=400",
      video: "https://example.com/dance-reel.mp4",
      followers: 1200,
      specialties: ["Contemporary", "Ballet", "Modern"],
    },
    {
      id: "michael-theatre-1",
      name: "Michael Chen",
      profession: "Theatre Director",
      location: "London, UK",
      image: "/placeholder.svg?height=400&width=400",
      video: "https://example.com/theatre-reel.mp4",
      followers: 3400,
      specialties: ["Classical", "Contemporary", "Musical"],
    },
    {
      id: "elena-circus-1",
      name: "Elena Rodriguez",
      profession: "Circus Artist",
      location: "Montreal, Canada",
      image: "/placeholder.svg?height=400&width=400",
      video: "https://example.com/circus-reel.mp4",
      followers: 2800,
      specialties: ["Aerial", "Acrobatics", "Dance"],
    },
  ]

  const upcomingShows = [
    {
      id: "show-1",
      title: "Swan Lake",
      company: "National Ballet Company",
      date: "March 15-20, 2024",
      venue: "Grand Theatre",
      image: "/placeholder.svg?height=300&width=500",
    },
    {
      id: "show-2",
      title: "Hamlet",
      company: "Shakespeare Theatre Company",
      date: "April 5-15, 2024",
      venue: "Royal Theatre",
      image: "/placeholder.svg?height=300&width=500",
    },
    {
      id: "show-3",
      title: "Cirque Nouveau",
      company: "Modern Circus Arts",
      date: "May 1-10, 2024",
      venue: "Circus Arena",
      image: "/placeholder.svg?height=300&width=500",
    },
  ]

  const opportunities = [
    {
      id: 1,
      title: "Dance Instructor",
      company: "National Dance Academy",
      companyLogo: "/placeholder.svg",
      location: "Mumbai, India",
      type: "Full Time",
      category: "dance",
      salary: "₹40,000 - ₹60,000 per month",
      posted: "2 days ago",
      deadline: "March 30, 2024",
      requirements: [
        "5+ years teaching experience",
        "Expertise in classical dance forms",
        "Teaching certification preferred",
      ],
    },
    {
      id: 2,
      title: "Theatre Artist",
      company: "Prithvi Theatre",
      companyLogo: "/placeholder.svg",
      location: "Mumbai, India",
      type: "Project Based",
      category: "theatre",
      salary: "Project based compensation",
      posted: "1 week ago",
      deadline: "April 15, 2024",
      requirements: ["Professional acting experience", "Strong stage presence", "Availability for regular rehearsals"],
    },
    {
      id: 3,
      title: "Circus Arts Trainer",
      company: "Modern Circus Academy",
      companyLogo: "/placeholder.svg",
      location: "Bangalore, India",
      type: "Full Time",
      category: "circus",
      salary: "₹45,000 - ₹65,000 per month",
      posted: "3 days ago",
      deadline: "March 25, 2024",
      requirements: ["Professional circus arts experience", "Safety certification", "Teaching experience"],
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
      : featuredArtists.filter((artist) => artist.category === selectedCategory)

  const filteredOpportunities =
    selectedCategory === "all" ? opportunities : opportunities.filter((job) => job.category === selectedCategory)

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Featured Artists</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredArtists.map((artist) => (
            <Card key={artist.id} className="bg-[#1A1A1A] border-[#2f2f2f] overflow-hidden">
              <div className="relative h-48">
                <Image src={artist.image || "/placeholder.svg"} alt={artist.name} fill className="object-cover" />
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Button variant="outline" className="text-white border-white">
                    <Play className="h-4 w-4 mr-2" />
                    Watch Reel
                  </Button>
                </div>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <Link
                    href={`/profile/${artist.id}`}
                    className="text-lg font-semibold text-white hover:text-primary transition-colors"
                  >
                    {artist.name}
                  </Link>
                  <p className="text-muted-foreground">{artist.profession}</p>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{artist.location}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{artist.followers.toLocaleString()} followers</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {artist.specialties.map((specialty) => (
                    <span key={specialty} className="px-2 py-1 text-xs rounded-full bg-[#2f2f2f] text-white">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Upcoming Shows</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingShows.map((show) => (
            <Card key={show.id} className="bg-[#1A1A1A] border-[#2f2f2f] overflow-hidden">
              <div className="relative h-40">
                <Image src={show.image || "/placeholder.svg"} alt={show.title} fill className="object-cover" />
              </div>
              <div className="p-4 space-y-2">
                <h3 className="text-lg font-semibold text-white">{show.title}</h3>
                <p className="text-primary">{show.company}</p>
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{show.date}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{show.venue}</span>
                </div>
                <Button className="w-full mt-2">Book Tickets</Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}

