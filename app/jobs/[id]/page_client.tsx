"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { getJob } from "@/lib/api"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Briefcase, DollarSign, Calendar, Mail, Globe, User, ArrowLeft } from "lucide-react"

export default function JobDetailClient() {
  const params = useParams()
  const router = useRouter()
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchJob() {
      try {
        setLoading(true)
        const jobData = await getJob(params.id as string)
        setJob(jobData)
      } catch (err) {
        console.error("Failed to load job", err)
        setError("Job not found")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchJob()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="container max-w-4xl py-6 text-white">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-t-transparent border-gray-400" />
        </div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="container max-w-4xl py-6 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Job Not Found</h1>
          <p className="text-muted-foreground mb-6">The job you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.push("/jobs")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-6 text-white">
      {/* Back button */}
      <Button 
        variant="ghost" 
        onClick={() => router.back()}
        className="mb-6 text-white hover:bg-ink-hover"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      {/* Job Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
        <div className="flex items-center gap-2 text-lg text-muted-foreground mb-4">
          <User className="h-5 w-5" />
          {job.companyName || "Company"}
        </div>
        
        {/* Job badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="border-primary/20 text-primary">
            <Briefcase className="h-3 w-3 mr-1" />
            {job.jobType?.replace('_', ' ') || 'Full Time'}
          </Badge>
          
          {(job.locationCity || job.locationCountry) && (
            <Badge variant="outline" className="border-ink">
              <MapPin className="h-3 w-3 mr-1" />
              {[job.locationCity, job.locationCountry].filter(Boolean).join(", ")}
            </Badge>
          )}
          
          {job.employmentMode && (
            <Badge variant="outline" className="border-ink">
              {job.employmentMode.charAt(0).toUpperCase() + job.employmentMode.slice(1)}
            </Badge>
          )}
          
          {(job.salaryMin || job.salaryMax) && (
            <Badge variant="outline" className="border-ink">
              <DollarSign className="h-3 w-3 mr-1" />
              {job.salaryMin ? `${job.salaryMin}` : ""}
              {job.salaryMin && job.salaryMax ? " - " : ""}
              {job.salaryMax ? `${job.salaryMax}` : ""}
              {job.salaryCurrency ? ` ${job.salaryCurrency}` : ""}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Description */}
          <Card className="p-6 bg-ink-light border-ink">
            <h2 className="text-xl font-semibold mb-4">Job Description</h2>
            <div className="prose prose-invert max-w-none">
              <p className="whitespace-pre-wrap">{job.description}</p>
            </div>
          </Card>

          {/* Skills */}
          {job.skills && job.skills.length > 0 && (
            <Card className="p-6 bg-ink-light border-ink">
              <h2 className="text-xl font-semibold mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill: string, index: number) => (
                  <Badge key={index} variant="secondary" className="bg-primary/10 text-primary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {/* Experience */}
          {(job.experienceMinYears || job.experienceMaxYears) && (
            <Card className="p-6 bg-ink-light border-ink">
              <h2 className="text-xl font-semibold mb-4">Experience Required</h2>
              <p className="text-muted-foreground">
                {job.experienceMinYears ? `${job.experienceMinYears}` : "0"}
                {job.experienceMinYears && job.experienceMaxYears ? " - " : ""}
                {job.experienceMaxYears ? `${job.experienceMaxYears}` : "+"}
                {" years"}
              </p>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Application Info */}
          <Card className="p-6 bg-ink-light border-ink">
            <h2 className="text-xl font-semibold mb-4">How to Apply</h2>
            <div className="space-y-3">
              {job.applicationEmail && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <a 
                    href={`mailto:${job.applicationEmail}`}
                    className="text-primary hover:underline"
                  >
                    {job.applicationEmail}
                  </a>
                </div>
              )}
              
              {job.applicationUrl && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" />
                  <a 
                    href={job.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Apply Online
                  </a>
                </div>
              )}
            </div>
          </Card>

          {/* Job Details */}
          <Card className="p-6 bg-ink-light border-ink">
            <h2 className="text-xl font-semibold mb-4">Job Details</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Posted:</span>
                <span>{new Date(job.createdAt).toLocaleDateString()}</span>
              </div>
              
              {job.applicationDeadline && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deadline:</span>
                  <span>{new Date(job.applicationDeadline).toLocaleDateString()}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant="outline" className="border-green-500 text-green-500">
                  {job.status || "Published"}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Company Info */}
          {job.companyWebsite && (
            <Card className="p-6 bg-ink-light border-ink">
              <h2 className="text-xl font-semibold mb-4">Company</h2>
              <div className="space-y-2">
                <p className="font-medium">{job.companyName}</p>
                <a 
                  href={job.companyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm"
                >
                  Visit Company Website
                </a>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

