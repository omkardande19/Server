"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { listJobs, JobDto } from "@/lib/api"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Briefcase, DollarSign, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function JobsPageClient() {
  const [jobs, setJobs] = useState<JobDto[]>([])
  const [q, setQ] = useState("")
  const [loading, setLoading] = useState(false)

  async function fetchJobs() {
    try {
      setLoading(true)
      const data = await listJobs(q ? { q } : undefined)
      setJobs(data)
    } catch (err) {
      console.error("Failed to load jobs", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="container max-w-5xl py-6 space-y-6 text-white">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search jobs..."
            className="pl-9 bg-[#1f1f1f] border-[#2f2f2f] text-white"
          />
        </div>
        <Button onClick={fetchJobs} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      <div className="space-y-3">
        {jobs.map((job) => (
          <Card key={job._id} className="p-5 bg-ink-light border-ink">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Link href={`/jobs/${job._id}`} className="text-lg font-semibold hover:text-primary">
                  {job.title}
                </Link>
                <div className="mt-1 text-sm text-muted-foreground">
                  {job.companyName || "Company"}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {job.jobType ? (
                    <Badge variant="outline" className="border-primary/20 text-primary">
                      <Briefcase className="h-3 w-3 mr-1" /> {job.jobType}
                    </Badge>
                  ) : null}
                  {(job.locationCity || job.locationCountry) ? (
                    <Badge variant="outline" className="border-ink">
                      <MapPin className="h-3 w-3 mr-1" />
                      {[job.locationCity, job.locationCountry].filter(Boolean).join(", ")}
                    </Badge>
                  ) : null}
                  {(job.salaryMin || job.salaryMax) ? (
                    <Badge variant="outline" className="border-ink">
                      <DollarSign className="h-3 w-3 mr-1" />
                      {job.salaryMin ?? ""}{job.salaryMax ? ` - ${job.salaryMax}` : ""} {job.salaryCurrency || ""}
                    </Badge>
                  ) : null}
                </div>
                <p className="mt-3 text-muted-foreground line-clamp-2">
                  {job.description}
                </p>
              </div>
              <div className="shrink-0">
                <Button asChild>
                  <Link href={`/jobs/${job._id}`}>View</Link>
                </Button>
              </div>
            </div>
          </Card>
        ))}
        {!jobs.length && !loading ? (
          <div className="text-muted-foreground">No jobs found.</div>
        ) : null}
      </div>
    </div>
  )
}



