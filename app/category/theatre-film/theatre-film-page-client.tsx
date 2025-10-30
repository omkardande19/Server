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
  Camera,
  Clapperboard,
  Theater,
  Video,
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
  Film,
  Award,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TheatreFilmPageClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("all")
  const [isPlaying, setIsPlaying] = useState<{ [key: string]: boolean }>({})

  const categories = [
    { id: "theatre", name: "Theatre", icon: Theater },
    { id: "film", name: "Film", icon: Film },
  ]

  const subCategories = {
    theatre: [
      { id: "acting", name: "Acting", icon: Theater },
      { id: "directing", name: "Directing", icon: Video },
      { id: "production", name: "Production", icon: Clapperboard },
      { id: "playwriting", name: "Playwriting", icon: Theater },
    ],
    film: [
      { id: "acting", name: "Acting", icon: Video },
      { id: "directing", name: "Directing", icon: Clapperboard },
      { id: "cinematography", name: "Cinematography", icon: Camera },
      { id: "screenwriting", name: "Screenwriting", icon: Film },
    ],
  }

  const featuredArtists = [
    {
      id: 1,
      name: "Rajesh Kumar",
      image: "/placeholder.svg",
      coverImage: "/placeholder.svg",
      title: "Theatre Actor & Director",
      category: "theatre",
      location: "Mumbai, India",
      followers: 3245,
      isVerified: true,
      specialization: ["Stage Acting", "Theatre Direction"],
      recentWork: "Hamlet - National Theatre Production",
      awards: ["Best Actor - Theatre Awards 2023"],
      showreel: "/placeholder.mp4",
    },
    {
      id: 2,
      name: "Priya Singh",
      image: "/placeholder.svg",
      coverImage: "/placeholder.svg",
      title: "Film Director & Screenwriter",
      category: "film",
      location: "Mumbai, India",
      followers: 5892,
      isVerified: true,
      specialization: ["Film Direction", "Screenwriting"],
      recentWork: "The Last Summer - Feature Film",
      awards: ["Best Director - Independent Film Festival"],
      showreel: "/placeholder.mp4",
    },
    {
      id: 3,
      name: "Amit Sharma",
      image: "/placeholder.svg",
      coverImage: "/placeholder.svg",
      title: "Actor",
      category: "both",
      location: "Delhi, India",
      followers: 4156,
      isVerified: true,
      specialization: ["Method Acting", "Voice Acting"],
      recentWork: "Romeo & Juliet - Theatre | The Dark Night - Film",
      awards: ["Best Supporting Actor - Film Awards 2023"],
      showreel: "/placeholder.mp4",
    },
  ]

  const upcomingProductions = [
    {
      id: 1,
      title: "Macbeth - Modern Adaptation",
      type: "theatre",
      company: "National Theatre Company",
      image: "/placeholder.svg",
      date: "March 15-30, 2024",
      time: "7:00 PM",
      location: "National Theatre, Mumbai",
      price: "₹500 onwards",
      description: "A contemporary take on Shakespeare's classic tragedy",
      director: "Rajesh Kumar",
      cast: ["Amit Sharma", "Priya Verma"],
      category: "theatre",
    },
    {
      id: 2,
      title: "The Silent Echo",
      type: "film",
      company: "Indie Films Production",
      image: "/placeholder.svg",
      date: "April 5, 2024",
      location: "PVR Cinemas, Nationwide",
      price: "Regular Cinema Rates",
      description: "An indie drama exploring urban isolation",
      director: "Priya Singh",
      cast: ["Amit Sharma", "Neha Kapoor"],
      category: "film",
    },
  ]

  const opportunities = [
    {
      id: 1,
      title: "Theatre Director",
      company: "Creative Stage Productions",
      companyLogo: "/placeholder.svg",
      location: "Mumbai, India",
      type: "Full Time",
      category: "theatre",
      salary: "₹60,000 - ₹80,000 per month",
      posted: "2 days ago",
      deadline: "March 30, 2024",
      requirements: ["5+ years theatre experience", "Experience in directing"],
    },
    {
      id: 2,
      title: "Film Actor - Lead Role",
      company: "Sunrise Studios",
      companyLogo: "/placeholder.svg",
      location: "Mumbai, India",
      type: "Project Based",
      category: "film",
      salary: "As per industry standards",
      posted: "1 week ago",
      deadline: "April 15, 2024",
      requirements: ["Acting experience", "Age: 25-35", "Hindi & English fluency"],
    },
    {
      id: 3,
      title: "Production Assistant",
      company: "Theatre & Film Collective",
      companyLogo: "/placeholder.svg",
      location: "Delhi, India",
      type: "Full Time",
      category: "both",
      salary: "₹25,000 - ₹35,000 per month",
      posted: "3 days ago",
      deadline: "March 25, 2024",
      requirements: ["1+ year experience", "Knowledge of production processes"],
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

  const filteredProductions =
    selectedCategory === "all"
      ? upcomingProductions
      : upcomingProductions.filter((production) => production.category === selectedCategory)

  const filteredOpportunities =
    selectedCategory === "all"
      ? opportunities
      : opportunities.filter((job) => job.category === selectedCategory || job.category === "both")

  return (
    <div className="container max-w-7xl py-6 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <Theater className="h-8 w-8 text-primary" />
          <span className="text-primary">/</span>
          <Film className="h-8 w-8 text-primary" />
          Theatre & Film
        </h1>
        <p className="text-muted-foreground">
          Discover talented actors, directors, upcoming productions, and opportunities in theatre and film
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
          <Input placeholder="Search artists, productions..." className="pl-10 bg-ink-light border-ink text-white" />
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
          <TabsTrigger value="productions" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <Clapperboard className="h-4 w-4 mr-2" />
            Productions
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
                      <div className="mt-3 text-sm text-muted-foreground">
                        <p className="font-medium text-white">Recent Work:</p>
                        <p>{artist.recentWork}</p>
                      </div>
                      {artist.awards.length > 0 && (
                        <div className="flex items-center gap-2 mt-3">
                          <Award className="h-4 w-4 text-primary" />
                          <span className="text-sm text-muted-foreground">{artist.awards[0]}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-ink">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-ink text-white hover:bg-ink-hover"
                          onClick={() => togglePlay(artist.id.toString())}
                        >
                          {isPlaying[artist.id] ? (
                            <Pause className="h-4 w-4 mr-2" />
                          ) : (
                            <Play className="h-4 w-4 mr-2" />
                          )}
                          Watch Showreel
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Productions Tab */}
        <TabsContent value="productions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProductions.map((production) => (
              <Card key={production.id} className="overflow-hidden bg-ink-light border-ink">
                <div className="md:flex">
                  <div className="relative h-48 md:h-auto md:w-72">
                    <Image
                      src={production.image || "/placeholder.svg"}
                      alt={production.title}
                      fill
                      className="object-cover"
                    />
                    <Badge
                      variant="outline"
                      className="absolute top-2 left-2 border-primary/20 bg-black/50 text-primary"
                    >
                      {production.type === "theatre" ? "Theatre" : "Film"}
                    </Badge>
                  </div>
                  <div className="p-6 flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-white">{production.title}</h3>
                        <p className="text-primary">{production.company}</p>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{production.description}</p>
                    <div className="mt-3">
                      <p className="text-sm text-white">Director: {production.director}</p>
                      <p className="text-sm text-muted-foreground">Cast: {production.cast.join(", ")}</p>
                    </div>
                    <div className="flex flex-col gap-2 mt-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        {production.date}
                        {production.time && ` at ${production.time}`}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4" />
                        {production.location}
                      </div>
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                      <p className="text-sm font-medium text-white">{production.price}</p>
                      <Button className="bg-primary hover:bg-primary/90">
                        {production.type === "theatre" ? (
                          <>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Book Tickets
                          </>
                        ) : (
                          <>
                            <Film className="mr-2 h-4 w-4" />
                            More Info
                          </>
                        )}
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

