"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  MapPin,
  Briefcase,
  Clock,
  Filter,
  Music,
  Palette,
  Camera,
  Mic,
  PenTool,
  Building2,
  Calendar,
  DollarSign,
  Bookmark,
  Share2,
  TrendingUp,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"
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

export default function OpportunitiesPageClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedLocation, setSelectedLocation] = useState<string>("all")
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null)
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false)
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>([])

  const categories = [
    { id: "visual", name: "Visual Arts", icon: Palette },
    { id: "music", name: "Music", icon: Music },
    { id: "photography", name: "Photography", icon: Camera },
    { id: "performing", name: "Performing Arts", icon: Mic },
    { id: "writing", name: "Writing", icon: PenTool },
  ]

  const jobTypes = [
    { id: "full-time", name: "Full Time" },
    { id: "part-time", name: "Part Time" },
    { id: "contract", name: "Contract" },
    { id: "freelance", name: "Freelance" },
    { id: "internship", name: "Internship" },
  ]

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
    setFilteredOpportunities(opportunities);
  }, [opportunities]);

  const applyFilters = () => {
    const filtered = opportunities.filter((job) => {
      if (selectedCategory !== "all" && job.category !== selectedCategory) return false;
      if (selectedType !== "all" && job.type !== selectedType) return false;
      if (selectedLocation !== "all" && !job.location.toLowerCase().includes(selectedLocation.toLowerCase())) return false;
      return true;
    });
    setFilteredOpportunities(filtered);
  };

  // Update the function to use the defined type
  const handleApplyClick = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity)
    setIsDetailViewOpen(true)
  }

  const calculateDaysAgo = (postedDate: string) => {
    const posted = new Date(postedDate);
    const now = new Date();
    const differenceInTime = now.getTime() - posted.getTime();
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays;
  };

  return (
    <div className="container max-w-7xl py-6 space-y-8 bg-[#1A1A1A] text-white">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Creative Opportunities</h1>
        <p className="text-muted-foreground">
          Discover jobs, gigs, auditions, and opportunities in the creative industry
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="p-6 bg-[#1A1A1A] border-[#2f2f2f]">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search opportunities..." className="pl-10 bg-[#1f1f1f] border-[#2f2f2f] text-white rounded-lg shadow-md" />
          </div>
          <Select onValueChange={setSelectedCategory} defaultValue="all">
            <SelectTrigger className="bg-[#1f1f1f] border-[#2f2f2f] text-white rounded-lg shadow-md">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1A1A] border-[#2f2f2f] rounded-lg shadow-md">
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id} className="text-white">
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={setSelectedType} defaultValue="all">
            <SelectTrigger className="bg-[#1f1f1f] border-[#2f2f2f] text-white rounded-lg shadow-md">
              <Briefcase className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Job Type" />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1A1A] border-[#2f2f2f] rounded-lg shadow-md">
              <SelectItem value="all">All Types</SelectItem>
              {jobTypes.map((type) => (
                <SelectItem key={type.id} value={type.id} className="text-white">
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={setSelectedLocation} defaultValue="all">
            <SelectTrigger className="bg-[#1f1f1f] border-[#2f2f2f] text-white rounded-lg shadow-md">
              <MapPin className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1A1A] border-[#2f2f2f] rounded-lg shadow-md">
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="mumbai">Mumbai</SelectItem>
              <SelectItem value="delhi">Pune</SelectItem>
              <SelectItem value="bangalore">Bangalore</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6">
        {/* Opportunities List */}
        <div className="space-y-6">
          {/* Quick Filters */}
          <div className="flex justify-end gap-2 overflow-x-auto pb-2">
            <Button className="border-ink text-white hover:bg-ink-hover whitespace-nowrap">
              Cancel
            </Button>
            <Button className="border-ink text-white hover:bg-ink-hover whitespace-nowrap" onClick={applyFilters}>
              Apply
            </Button>
          </div>

          {/* Opportunities */}
          <div className="space-y-4">
            {filteredOpportunities.map((job) => (
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
                    <p className="mt-3 text-muted-foreground">
                      {job.description.length > 60 ? `${job.description.substring(0, 80)}...` : job.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-ink">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-4 w-4" />
                        Posted {calculateDaysAgo(job.postedDate)} days ago
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
        </div>
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

