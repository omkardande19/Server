"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from 'aws-amplify/auth'
import { ImageCarousel } from "@/components/image-carousel"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Pencil, Share2, Home, CalendarDays, Briefcase, Building2, Bookmark, MapPin, Clock, DollarSign, Calendar, Users, MoreHorizontal } from "lucide-react"
import Image from "next/image"
import Link from "next/link" // Add Link import
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import DetailedView from '../../components/DetailedView'

// Define the type for an opportunity
interface Opportunity {
  id: number;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  type: string;
  category: string;
  salary: string;
  postedDate: string;
  deadline: string;
  description: string;
  featured: boolean;
  applications: number;
  email: string;
}

// Define a type for the event objects
interface Event {
  id: number;
  title: string;
  organizer: string;
  location: string;
  date: string;
  description: string;
  featured: boolean;
  attendees: number;
  imageUrl: string;
}

export default function DashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userInfo, setUserInfo] = useState<any>(null)
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null)
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false)
  const [events, setEvents] = useState<Event[]>([])

  const carouselImages = [
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/music.jpg-BgJDyXFgvaQre3Zea0RThxK3vWllwQ.jpeg",
      alt: "Musical instruments and artistic setup",
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/acting.jpg-JrSlfv9YhD6NkPCqdVnpuShAlKcNp0.jpeg",
      alt: "Collection of movie posters",
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/painting.jpg-3lfFkIHuCjeCMYmIjxaECF8C76m1px.jpeg",
      alt: "Art and paintings collection",
    },
  ]

  const filteredPosts = [
    {
      id: "art-gallery-1", // Added IDs for each post
      user: "Art Gallery Express",
      role: "Art Gallery",
      talent: "Visual Arts",
      time: "2h",
      content:
        "🎨 Calling all painters and visual artists! We're hosting a contemporary art exhibition next month. Theme: 'Urban Perspectives'. Submit your portfolio by clicking the link below. #ArtGallery #VisualArts",
      image: "/placeholder.svg",
      likes: 89,
      comments: 34,
    },
    {
      id: "symphony-1",
      user: "Symphony Orchestra",
      role: "Music Organization",
      talent: "Music",
      time: "3h",
      content:
        "🎵 Looking for experienced violinists and cellists for our upcoming concert series. Classical training required. Auditions next week. DM for details. #ClassicalMusic #Musicians",
      image: "/placeholder.svg",
      likes: 156,
      comments: 23,
    },
    {
      id: "theatre-1",
      user: "National Theatre Company",
      role: "Theatre Group",
      talent: "Performing Arts",
      time: "4h",
      content:
        "🎭 Casting call for our new production! Seeking theatre artists with experience in contemporary drama. Both lead and supporting roles available. #Theatre #Acting",
      image: "/placeholder.svg",
      likes: 124,
      comments: 45,
    },
    {
      id: "literary-1",
      user: "Literary Magazine",
      role: "Publishing House",
      talent: "Writing",
      time: "5h",
      content:
        "✍️ Open submissions for our quarterly issue! Looking for original poetry, short stories, and creative non-fiction. Theme: 'Urban Life'. #Writers #LiteraryArts",
      image: "/placeholder.svg",
      likes: 78,
      comments: 28,
    },
  ]

  const jobTypes = [
    { id: "full-time", name: "Full Time" },
    { id: "part-time", name: "Part Time" },
    { id: "contract", name: "Contract" },
    { id: "freelance", name: "Freelance" },
    { id: "internship", name: "Internship" },
  ];

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await fetch("https://d69leb59mi.execute-api.ap-south-1.amazonaws.com/prod/jobs/date-range");
        if (!response.ok) {
          throw new Error("Failed to fetch opportunities");
        }
        const data = await response.json();
        setOpportunities(data);
      } catch (error) {
        console.error("Error fetching opportunities:", error);
      }
    };

    fetchOpportunities();
  }, []);

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("https://bfk8w11dpc.execute-api.ap-south-1.amazonaws.com/prod/events/list");
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  async function checkAuth() {
    try {
      const user = await getCurrentUser()
      console.log('User is authenticated:', user)
      setIsAuthenticated(true)
      setUserInfo(user)
      setIsLoading(false)
    } catch (error) {
      console.log('User is not authenticated:', error)
      setIsAuthenticated(false)
      setUserInfo(null)
      setIsLoading(false)
      router.push('/login')
    }
  }

  const handleApplyClick = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity)
    setIsDetailViewOpen(true)
  }

  if (isLoading) {
    return <div>Loading...</div> // Or your loading component
  }

  if (!isAuthenticated) {
    return null // Let the router handle the redirect
  }

  return (
    <div className="space-y-6">
      {/* <section className="space-y-4">
        <h1 className="text-2xl font-bold text-white">Welcome to Artist Katta</h1>
        <p className="text-muted-foreground">
          Connect with fellow artists, discover opportunities, and showcase your work
        </p>
      </section> */}

<Card className="p-4 bg-[#1A1A1A] border-[#2f2f2f]">
        <div className="flex space-x-3">
          <div className="w-10 h-10 rounded-full bg-[#1f1f1f] flex items-center justify-center">
            <Pencil className="h-5 w-5 text-white" />
          </div>
          <Input
            placeholder="Share your work, opportunities, or connect with fellow artists..."
            className="bg-[#1f1f1f] border-[#2f2f2f] text-white placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex items-center gap-2 mt-3 ml-[52px]">
          <Button variant="ghost" size="sm" className="text-white hover:bg-[#1f1f1f]">
            <Home className="mr-2 h-4 w-4" />
            Agencies
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-[#1f1f1f]">
            <CalendarDays className="mr-2 h-4 w-4" />
            Event
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-[#1f1f1f]">
            <Briefcase className="mr-2 h-4 w-4" />
            Opportunity
          </Button>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6 bg-ink-light border-ink">
          <h2 className="text-lg font-semibold text-white mb-2">Latest Opportunities</h2>
          <p className="text-muted-foreground mb-4">Find your next creative project or collaboration</p>
          <Button className="w-full">Browse Jobs</Button>
        </Card>

        <Card className="p-6 bg-ink-light border-ink">
          <h2 className="text-lg font-semibold text-white mb-2">Featured Agencies</h2>
          <p className="text-muted-foreground mb-4">Discover talented artists in your field</p>
          <Button className="w-full">Explore Agencies</Button>
        </Card>

        <Card className="p-6 bg-ink-light border-ink">
          <h2 className="text-lg font-semibold text-white mb-2">Community Events</h2>
          <p className="text-muted-foreground mb-4">Join workshops, meetups, and exhibitions</p>
          <Button className="w-full">View Events</Button>
        </Card>
      </div>



      <div className="relative h-48 rounded-xl overflow-hidden">
        <ImageCarousel images={carouselImages} />
      </div>

      {/* <Card className="p-4 mb-4 bg-[#1A1A1A] border-[#2f2f2f]">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {["All", "Visual Arts", "Music", "Performing Arts", "Writing"].map((filter) => (
            <Button
              key={filter}
              variant={filter === "All" ? "default" : "outline"}
              size="sm"
              className={cn(
                "whitespace-nowrap",
                filter === "All"
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "border-[#2f2f2f] text-white hover:bg-[#1f1f1f]",
              )}
            >
              {filter}
            </Button>
          ))}
        </div>
      </Card> */}

      <h2 className="text-xl font-bold text-white mb-4">Upcoming Events</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events.slice(0, 3).map((event) => (
          <Card key={event.id} className="p-4 space-y-4 bg-[#1A1A1A] border-[#2f2f2f]">
            <div className="flex items-center space-x-3">
              <Image
                src={event.imageUrl || "/placeholder.svg"}
                alt={event.title}
                width={40}
                height={40}
                className="rounded-full hover:opacity-80 transition-opacity"
              />
              <div>
                <h3 className="font-semibold text-white hover:text-primary transition-colors">
                  {event.title}
                </h3>
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>{event.organizer}</span>
                  <span className="mx-1">•</span>
                  <span>{event.date}</span>
                </div>
              </div>
            </div>
            <p className="text-white">{event.description}</p>
            <div className="flex items-center justify-between pt-2 border-t border-[#2f2f2f]">
              <Button variant="ghost" size="sm" className="text-white hover:bg-[#1f1f1f]" onClick={() => router.push('/messages')}>
                More
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <h2 className="text-xl font-bold text-white mb-4">Jobs/Opportunities</h2>
      <div className="grid gap-4 grid-cols-1">
        {opportunities.map((job) => (
          <Card
            key={job.id}
            className={cn(
              "p-6 bg-ink-light border-ink hover:border-primary/50 transition-colors",
              job.featured && "border-l-4 border-l-primary",
            )}
          >
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
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                      <Bookmark className="h-4 w-4" />
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
                    Posted {job.postedDate}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-1 h-4 w-4" />
                    Deadline: {job.deadline}
                  </div>
                  {/* <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="mr-1 h-4 w-4" />
                    {job.applications} applications
                  </div> */}
                  <div className="ml-auto">
                    <Button className="bg-primary hover:bg-primary/90" onClick={() => handleApplyClick(job)}>
                      Apply Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {isDetailViewOpen && selectedOpportunity && (
        <DetailedView
          item={selectedOpportunity}
          onClose={() => setIsDetailViewOpen(false)}
        />
      )}
    </div>
  )
}

