"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getJobHistory, getCurrentUser } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { 
  BarChart3, 
  FileText, 
  Upload, 
  Eye, 
  Users, 
  Calendar,
  ArrowLeft,
  Download
} from "lucide-react"

export default function JobHistoryPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState<boolean | null>(null)
  const [historyData, setHistoryData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    async function checkAuth() {
      try {
        const user = await getCurrentUser()
        if (user?.userCategory === "company") {
          setAuthorized(true)
          await loadHistoryData()
        } else {
          setAuthorized(false)
          router.push("/jobs")
        }
      } catch (err) {
        setAuthorized(false)
        router.push("/login")
      }
    }
    checkAuth()
  }, [router])

  async function loadHistoryData() {
    try {
      setLoading(true)
      const data = await getJobHistory()
      setHistoryData(data)
    } catch (err) {
      console.error("Failed to load job history", err)
    } finally {
      setLoading(false)
    }
  }

  if (authorized === null || loading) {
    return (
      <div className="container max-w-6xl py-6 text-white">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-t-transparent border-gray-400" />
        </div>
      </div>
    )
  }

  if (!authorized) return null

  const { stats, uploadBatches, jobs } = historyData || {}

  return (
    <div className="container max-w-6xl py-6 text-white">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="text-white hover:bg-ink-hover"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Job Posting History</h1>
          <p className="text-gray-400">Track your job posting activity and performance</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-[#1f1f1f] border-[#2f2f2f]">
          <TabsTrigger value="overview" className="data-[state=active]:bg-[#2a2a2a]">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="jobs" className="data-[state=active]:bg-[#2a2a2a]">
            <FileText className="h-4 w-4 mr-2" />
            All Jobs
          </TabsTrigger>
          <TabsTrigger value="batches" className="data-[state=active]:bg-[#2a2a2a]">
            <Upload className="h-4 w-4 mr-2" />
            Upload Batches
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats?.totalJobs || 0}</div>
              </CardContent>
            </Card>

            <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Published</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">{stats?.publishedJobs || 0}</div>
              </CardContent>
            </Card>

            <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total Views</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">{stats?.totalViews || 0}</div>
              </CardContent>
            </Card>

            <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-400">{stats?.totalApplications || 0}</div>
              </CardContent>
            </Card>
          </div>

          {/* Upload Statistics */}
          <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
            <CardHeader>
              <CardTitle className="text-white">Upload Statistics</CardTitle>
              <CardDescription className="text-gray-400">
                Track your bulk upload activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">{stats?.fileUploads || 0}</div>
                  <div className="text-sm text-gray-400">Jobs from Files</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">{uploadBatches?.length || 0}</div>
                  <div className="text-sm text-gray-400">Upload Batches</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    {stats?.totalJobs ? Math.round(((stats?.fileUploads || 0) / stats.totalJobs) * 100) : 0}%
                  </div>
                  <div className="text-sm text-gray-400">Bulk Upload Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* All Jobs Tab */}
        <TabsContent value="jobs" className="space-y-4">
          <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
            <CardHeader>
              <CardTitle className="text-white">All Posted Jobs</CardTitle>
              <CardDescription className="text-gray-400">
                Complete list of your job postings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobs?.map((job: any) => (
                  <div key={job._id} className="p-4 bg-[#2a2a2a] rounded-lg border border-[#3f3f3f]">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-white font-medium">{job.title}</h3>
                        <p className="text-gray-400 text-sm">{job.companyName}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(job.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {job.views || 0} views
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {job.applicationsCount || 0} applications
                          </span>
                          {job.uploadedFromFile && (
                            <span className="flex items-center gap-1 text-blue-400">
                              <Upload className="h-3 w-3" />
                              From file
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={
                            job.status === 'published' ? 'border-green-500 text-green-500' :
                            job.status === 'draft' ? 'border-yellow-500 text-yellow-500' :
                            'border-red-500 text-red-500'
                          }
                        >
                          {job.status}
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => router.push(`/jobs/${job._id}`)}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Upload Batches Tab */}
        <TabsContent value="batches" className="space-y-4">
          <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
            <CardHeader>
              <CardTitle className="text-white">Upload Batches</CardTitle>
              <CardDescription className="text-gray-400">
                History of bulk job uploads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {uploadBatches?.map((batch: any) => (
                  <div key={batch._id} className="p-4 bg-[#2a2a2a] rounded-lg border border-[#3f3f3f]">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-white font-medium">{batch.fileName}</h3>
                        <p className="text-gray-400 text-sm">
                          {new Date(batch.batchDate).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="outline" className="border-blue-500 text-blue-500">
                        {batch.jobCount} jobs
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {batch.jobs?.map((job: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-[#1f1f1f] rounded">
                          <span className="text-white text-sm">{job.title}</span>
                          <Badge 
                            variant="outline" 
                            className={
                              job.status === 'published' ? 'border-green-500 text-green-500' :
                              job.status === 'draft' ? 'border-yellow-500 text-yellow-500' :
                              'border-red-500 text-red-500'
                            }
                          >
                            {job.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {(!uploadBatches || uploadBatches.length === 0) && (
                  <div className="text-center py-8 text-gray-400">
                    <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No bulk uploads yet</p>
                    <p className="text-sm">Upload files to see batch history here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

