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
  BookOpen,
  PenTool,
  Scroll,
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
  Award,
  Eye,
  ThumbsUp,
  MessageCircle,
  Book,
  FileText,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function LiteraturePageClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("all")

  const categories = [
    { id: "fiction", name: "Fiction", icon: Book },
    { id: "poetry", name: "Poetry", icon: PenTool },
    { id: "screenwriting", name: "Screenwriting", icon: Scroll },
    { id: "content", name: "Content Writing", icon: FileText },
  ]

  const subCategories = {
    fiction: ["Novel", "Short Story", "Children's Literature"],
    poetry: ["Modern Poetry", "Classical Poetry", "Spoken Word"],
    screenwriting: ["Film", "TV Series", "Web Series"],
    content: ["Creative Writing", "Technical Writing", "Copywriting"],
  }

  const featuredWriters = [
    {
      id: 1,
      name: "Anjali Sharma",
      image: "/placeholder.svg",
      coverImage: "/placeholder.svg",
      title: "Novelist & Poet",
      location: "Mumbai, India",
      followers: 2345,
      isVerified: true,
      genres: ["Contemporary Fiction", "Modern Poetry"],
      recentWork: "The Silent Echo - Novel",
      awards: ["Best Fiction Award 2023"],
      bio: "Bestselling author of contemporary fiction and modern poetry collections",
      featuredExcerpt: {
        title: "The Silent Echo",
        preview: "The city whispered its secrets to those who listened carefully...",
        readingTime: "8 min read",
        likes: 234,
        comments: 45,
      },
    },
    {
      id: 2,
      name: "Rahul Verma",
      image: "/placeholder.svg",
      coverImage: "/placeholder.svg",
      title: "Screenwriter",
      location: "Mumbai, India",
      followers: 1892,
      isVerified: true,
      genres: ["Film Screenplay", "TV Series"],
      recentWork: "Midnight Tales - Web Series",
      awards: ["Best Screenplay 2023"],
      bio: "Award-winning screenwriter for films and streaming series",
      featuredExcerpt: {
        title: "Midnight Tales",
        preview: "The neon lights flickered as the story unfolded...",
        readingTime: "5 min read",
        likes: 189,
        comments: 32,
      },
    },
    {
      id: 3,
      name: "Priya Malhotra",
      image: "/placeholder.svg",
      coverImage: "/placeholder.svg",
      title: "Content Writer & Poet",
      location: "Delhi, India",
      followers: 1567,
      isVerified: true,
      genres: ["Creative Writing", "Poetry"],
      recentWork: "Digital Dreams - Poetry Collection",
      awards: ["Content Creator of the Year 2023"],
      bio: "Versatile writer combining traditional poetry with modern content creation",
      featuredExcerpt: {
        title: "Digital Dreams",
        preview: "In the space between pixels, poetry finds its voice...",
        readingTime: "6 min read",
        likes: 156,
        comments: 28,
      },
    },
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: "Literary Festival 2024",
      organizer: "National Book Trust",
      image: "/placeholder.svg",
      date: "March 15-20, 2024",
      location: "Convention Center, Mumbai",
      type: "Festival",
      price: "Free Entry",
      description: "Annual literary festival featuring book launches, author interactions, and workshops",
      speakers: ["Anjali Sharma", "Rahul Verma"],
      highlights: ["Book Launches", "Author Meets", "Writing Workshops"],
    },
    {
      id: 2,
      title: "Screenwriting Masterclass",
      organizer: "Film Writers Association",
      image: "/placeholder.svg",
      date: "April 5, 2024",
      location: "Film City, Mumbai",
      type: "Workshop",
      price: "₹2000",
      description: "Intensive screenwriting workshop with industry experts",
      speakers: ["Rahul Verma"],
      highlights: ["Script Development", "Character Building", "Industry Insights"],
    },
  ]

  const opportunities = [
    {
      id: 1,
      title: "Fiction Editor",
      company: "Literary Publishing House",
      companyLogo: "/placeholder.svg",
      location: "Mumbai, India",
      type: "Full Time",
      category: "fiction",
      salary: "₹50,000 - ₹70,000 per month",
      posted: "2 days ago",
      deadline: "March 30, 2024",
      requirements: [
        "5+ years editing experience",
        "Strong understanding of fiction genres",
        "Excellence in English language",
      ],
    },
    {
      id: 2,
      title: "Content Writer",
      company: "Digital Media Agency",
      companyLogo: "/placeholder.svg",
      location: "Delhi, India",
      type: "Full Time",
      category: "content",
      salary: "₹40,000 - ₹60,000 per month",
      posted: "1 week ago",
      deadline: "April 15, 2024",
      requirements: ["3+ years content writing experience", "SEO knowledge", "Portfolio of published work"],
    },
    {
      id: 3,
      title: "Screenplay Writer",
      company: "Production House",
      companyLogo: "/placeholder.svg",
      location: "Mumbai, India",
      type: "Project Based",
      category: "screenwriting",
      salary: "As per industry standards",
      posted: "3 days ago",
      deadline: "March 25, 2024",
      requirements: [
        "Experience in screenplay writing",
        "Understanding of film/TV formats",
        "Previous produced work preferred",
      ],
    },
  ]

  const filteredWriters =
    selectedCategory === "all"
      ? featuredWriters
      : featuredWriters.filter((writer) =>
          writer.genres.some((genre) => genre.toLowerCase().includes(selectedCategory)),
        )

  const filteredOpportunities =
    selectedCategory === "all" ? opportunities : opportunities.filter((job) => job.category === selectedCategory)

  return (
    <div className="container max-w-7xl py-6 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-primary" />
          Literature
        </h1>
        <p className="text-muted-foreground">
          Discover writers, poets, upcoming literary events, and publishing opportunities
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
          <Input placeholder="Search writers, events..." className="pl-10 bg-ink-light border-ink text-white" />
        </div>
        <Select onValueChange={setSelectedSubCategory} defaultValue="all">
          <SelectTrigger className="bg-ink-light border-ink text-white">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by genre" />
          </SelectTrigger>
          <SelectContent className="bg-ink-light border-ink">
            <SelectItem value="all">All Genres</SelectItem>
            {selectedCategory !== "all" &&
              subCategories[selectedCategory as keyof typeof subCategories].map((subCategory) => (
                <SelectItem key={subCategory} value={subCategory.toLowerCase()}>
                  {subCategory}
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
      <Tabs defaultValue="writers" className="space-y-6">
        <TabsList className="bg-ink-light border-ink h-12">
          <TabsTrigger value="writers" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <Users className="h-4 w-4 mr-2" />
            Writers
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

        {/* Writers Tab */}
        <TabsContent value="writers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredWriters.map((writer) => (
              <Card key={writer.id} className="overflow-hidden bg-ink-light border-ink">
                <div className="relative h-32">
                  <Image src={writer.coverImage || "/placeholder.svg"} alt="" fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                </div>
                <div className="p-6 relative -mt-16">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <Image
                        src={writer.image || "/placeholder.svg"}
                        alt={writer.name}
                        width={80}
                        height={80}
                        className="rounded-lg border-4 border-ink-light"
                      />
                      {writer.isVerified && (
                        <div className="absolute -right-2 -bottom-2">
                          <Star className="h-6 w-6 text-primary fill-primary" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link
                            href={`/profile/${writer.id}`}
                            className="text-xl font-semibold text-white hover:text-primary"
                          >
                            {writer.name}
                          </Link>
                          <p className="text-primary">{writer.title}</p>
                        </div>
                        <Button variant="outline" size="sm" className="border-ink text-white hover:bg-ink-hover">
                          Follow
                        </Button>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <MapPin className="mr-1 h-4 w-4" />
                          {writer.location}
                        </div>
                        <div className="flex items-center">
                          <Users className="mr-1 h-4 w-4" />
                          {writer.followers.toLocaleString()} followers
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {writer.genres.map((genre, index) => (
                          <Badge key={index} variant="outline" className="border-primary/20 text-primary">
                            {genre}
                          </Badge>
                        ))}
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground">{writer.bio}</p>
                      {writer.awards.length > 0 && (
                        <div className="flex items-center gap-2 mt-3">
                          <Award className="h-4 w-4 text-primary" />
                          <span className="text-sm text-muted-foreground">{writer.awards[0]}</span>
                        </div>
                      )}

                      {/* Featured Excerpt */}
                      <Card className="mt-4 p-4 bg-ink-hover border-ink">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-white">{writer.featuredExcerpt.title}</h4>
                          <Badge variant="outline" className="border-primary/20 text-primary">
                            <Clock className="mr-1 h-3 w-3" />
                            {writer.featuredExcerpt.readingTime}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground italic">"{writer.featuredExcerpt.preview}"</p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              {writer.featuredExcerpt.likes}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              {writer.featuredExcerpt.comments}
                            </Button>
                          </div>
                          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                            <Eye className="h-4 w-4 mr-2" />
                            Read More
                          </Button>
                        </div>
                      </Card>
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
                    <p className="mt-2 text-sm text-muted-foreground">{event.description}</p>
                    <div className="mt-3">
                      <p className="text-sm text-white">Featured Speakers:</p>
                      <p className="text-sm text-muted-foreground">{event.speakers.join(", ")}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {event.highlights.map((highlight, index) => (
                        <Badge key={index} variant="outline" className="border-ink text-white">
                          {highlight}
                        </Badge>
                      ))}
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
                        Register Now
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
                    <div className="mt-3">
                      <p className="text-sm text-white">Requirements:</p>
                      <ul className="mt-1 text-sm text-muted-foreground list-disc list-inside">
                        {job.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
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

