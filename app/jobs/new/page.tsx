"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { createJob, getCurrentUser, uploadJobsFile } from "@/lib/api"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Upload, FileText, FileSpreadsheet, File } from "lucide-react"

export default function NewJobPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [authorized, setAuthorized] = useState<boolean | null>(null)
  const [bulkUploadStatus, setBulkUploadStatus] = useState<string>("")
  const [uploadedJobs, setUploadedJobs] = useState<any[]>([])
  const [form, setForm] = useState<any>({
    title: "",
    description: "",
    companyName: "",
    locationCity: "",
    locationCountry: "",
    isRemote: false,
    jobType: "full_time",
    employmentMode: "onsite",
    salaryMin: "",
    salaryMax: "",
    salaryCurrency: "INR",
    applicationEmail: "",
    applicationUrl: "",
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm((prev: any) => ({ ...prev, [name]: value }))
  }

  // Generate template files
  function downloadTemplate(format: 'txt' | 'json' | 'csv') {
    const sampleJobs = [
      {
        title: "Software Engineer",
        description: "We are looking for a skilled software engineer to join our team.",
        companyName: "Tech Corp",
        locationCity: "Mumbai",
        locationCountry: "India",
        isRemote: false,
        jobType: "full_time",
        employmentMode: "onsite",
        salaryMin: 500000,
        salaryMax: 800000,
        salaryCurrency: "INR",
        applicationEmail: "hr@techcorp.com",
        applicationUrl: "https://techcorp.com/careers"
      },
      {
        title: "Product Manager",
        description: "Lead product development and strategy for our flagship product.",
        companyName: "Tech Corp",
        locationCity: "Bangalore",
        locationCountry: "India",
        isRemote: true,
        jobType: "full_time",
        employmentMode: "remote",
        salaryMin: 800000,
        salaryMax: 1200000,
        salaryCurrency: "INR",
        applicationEmail: "hr@techcorp.com",
        applicationUrl: "https://techcorp.com/careers"
      }
    ]

    let content = ""
    let filename = ""
    let mimeType = ""

    if (format === 'txt') {
      content = sampleJobs.map(job => 
        `Title: ${job.title}\n` +
        `Description: ${job.description}\n` +
        `Company: ${job.companyName}\n` +
        `City: ${job.locationCity}\n` +
        `Country: ${job.locationCountry}\n` +
        `Remote: ${job.isRemote}\n` +
        `Job Type: ${job.jobType}\n` +
        `Employment Mode: ${job.employmentMode}\n` +
        `Salary Min: ${job.salaryMin}\n` +
        `Salary Max: ${job.salaryMax}\n` +
        `Currency: ${job.salaryCurrency}\n` +
        `Application Email: ${job.applicationEmail}\n` +
        `Application URL: ${job.applicationUrl}\n` +
        `---\n`
      ).join('\n')
      filename = "job_template.txt"
      mimeType = "text/plain"
    } else if (format === 'json') {
      content = JSON.stringify(sampleJobs, null, 2)
      filename = "job_template.json"
      mimeType = "application/json"
    } else if (format === 'csv') {
      const headers = Object.keys(sampleJobs[0]).join(',')
      const rows = sampleJobs.map(job => 
        Object.values(job).map(val => `"${val}"`).join(',')
      )
      content = [headers, ...rows].join('\n')
      filename = "job_template.csv"
      mimeType = "text/csv"
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Parse uploaded file
  async function handleFileUpload(file: File) {
    setLoading(true)
    setBulkUploadStatus("Processing file...")
    
    try {
      const text = await file.text()
      let jobs: any[] = []
      
      // Generate unique batch ID for this upload
      const batchId = `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      if (file.name.endsWith('.json')) {
        jobs = JSON.parse(text)
      } else if (file.name.endsWith('.txt')) {
        // Parse text format
        const sections = text.split('---').filter(section => section.trim())
        jobs = sections.map(section => {
          const lines = section.trim().split('\n')
          const job: any = {}
          lines.forEach(line => {
            const [key, ...valueParts] = line.split(':')
            if (key && valueParts.length > 0) {
              const value = valueParts.join(':').trim()
              const cleanKey = key.trim().toLowerCase().replace(/\s+/g, '')
              
              // Map to our schema
              switch(cleanKey) {
                case 'title': job.title = value; break
                case 'description': job.description = value; break
                case 'company': job.companyName = value; break
                case 'city': job.locationCity = value; break
                case 'country': job.locationCountry = value; break
                case 'remote': job.isRemote = value.toLowerCase() === 'true'; break
                case 'jobtype': job.jobType = value; break
                case 'employmentmode': job.employmentMode = value; break
                case 'salarymin': job.salaryMin = parseInt(value) || 0; break
                case 'salarymax': job.salaryMax = parseInt(value) || 0; break
                case 'currency': job.salaryCurrency = value; break
                case 'applicationemail': job.applicationEmail = value; break
                case 'applicationurl': job.applicationUrl = value; break
              }
            }
          })
          return job
        })
      } else if (file.name.endsWith('.csv')) {
        // Parse CSV format
        const lines = text.split('\n')
        const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim())
        jobs = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.replace(/"/g, '').trim())
          const job: any = {}
          headers.forEach((header, index) => {
            job[header] = values[index] || ''
          })
          return job
        })
      }

      setBulkUploadStatus(`Found ${jobs.length} jobs. Uploading...`)
      
      // Add file metadata to each job
      const jobsWithMetadata = jobs.map(job => ({
        ...job,
        uploadedFromFile: true,
        originalFileName: file.name,
        uploadBatchId: batchId
      }))
      
      // Upload jobs one by one
      const results = []
      for (const job of jobsWithMetadata) {
        try {
          const result = await createJob(job)
          results.push(result)
        } catch (err) {
          console.error('Failed to create job:', job.title, err)
        }
      }

      setUploadedJobs(results)
      setBulkUploadStatus(`Successfully uploaded ${results.length} out of ${jobs.length} jobs from ${file.name}!`)
      
    } catch (error) {
      console.error('File parsing error:', error)
      setBulkUploadStatus('Error parsing file. Please check the format.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    async function guard() {
      try {
        const user = await getCurrentUser()
        if (user?.userCategory === "company") {
          setAuthorized(true)
        } else {
          setAuthorized(false)
          router.replace("/jobs")
        }
      } catch (e) {
        setAuthorized(false)
        router.replace("/login")
      }
    }
    guard()
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const payload: any = {
        ...form,
        salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
      }
      const job = await createJob(payload)
      router.push(`/jobs/${job._id}`)
    } catch (err) {
      console.error("Create job failed", err)
      alert("Failed to create job. Make sure you are logged in as a company user.")
    } finally {
      setLoading(false)
    }
  }

  if (authorized === null) {
    return <div className="container max-w-3xl py-6 text-white">Checking access...</div>
  }

  if (!authorized) return null

  return (
    <div className="container max-w-3xl py-6 text-white">
      <h1 className="text-2xl font-semibold mb-4">Post a Job</h1>
      <Tabs defaultValue="form" className="space-y-4">
        <TabsList>
          <TabsTrigger value="form">Single Job</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
        </TabsList>
        <TabsContent value="form" className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="title" value={form.title} onChange={handleChange} placeholder="Job Title" className="bg-[#1f1f1f] border-[#2f2f2f] text-white" required />
        <Textarea name="description" value={form.description} onChange={handleChange} placeholder="Job Description" className="bg-[#1f1f1f] border-[#2f2f2f] text-white" required />
        <Input name="companyName" value={form.companyName} onChange={handleChange} placeholder="Company Name" className="bg-[#1f1f1f] border-[#2f2f2f] text-white" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input name="locationCity" value={form.locationCity} onChange={handleChange} placeholder="City" className="bg-[#1f1f1f] border-[#2f2f2f] text-white" />
          <Input name="locationCountry" value={form.locationCountry} onChange={handleChange} placeholder="Country" className="bg-[#1f1f1f] border-[#2f2f2f] text-white" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Select value={form.jobType} onValueChange={(v) => setForm((p: any) => ({ ...p, jobType: v }))}>
            <SelectTrigger className="bg-[#1f1f1f] border-[#2f2f2f] text-white">
              <SelectValue placeholder="Job Type" />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1A1A] border-[#2f2f2f]">
              <SelectItem value="full_time">Full Time</SelectItem>
              <SelectItem value="part_time">Part Time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="freelance">Freelance</SelectItem>
              <SelectItem value="internship">Internship</SelectItem>
              <SelectItem value="temporary">Temporary</SelectItem>
            </SelectContent>
          </Select>
          <Select value={form.employmentMode} onValueChange={(v) => setForm((p: any) => ({ ...p, employmentMode: v }))}>
            <SelectTrigger className="bg-[#1f1f1f] border-[#2f2f2f] text-white">
              <SelectValue placeholder="Employment Mode" />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1A1A] border-[#2f2f2f]">
              <SelectItem value="onsite">Onsite</SelectItem>
              <SelectItem value="remote">Remote</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input name="salaryMin" value={form.salaryMin} onChange={handleChange} placeholder="Salary Min" className="bg-[#1f1f1f] border-[#2f2f2f] text-white" />
          <Input name="salaryMax" value={form.salaryMax} onChange={handleChange} placeholder="Salary Max" className="bg-[#1f1f1f] border-[#2f2f2f] text-white" />
          <Input name="salaryCurrency" value={form.salaryCurrency} onChange={handleChange} placeholder="Currency (e.g., INR)" className="bg-[#1f1f1f] border-[#2f2f2f] text-white" />
        </div>
        <Input name="applicationEmail" value={form.applicationEmail} onChange={handleChange} placeholder="Application Email" className="bg-[#1f1f1f] border-[#2f2f2f] text-white" />
        <Input name="applicationUrl" value={form.applicationUrl} onChange={handleChange} placeholder="Application URL" className="bg-[#1f1f1f] border-[#2f2f2f] text-white" />
        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>{loading ? "Posting..." : "Post Job"}</Button>
          <Button type="button" variant="outline" onClick={() => history.back()}>Cancel</Button>
        </div>
          </form>
        </TabsContent>
        <TabsContent value="bulk" className="space-y-6">
          {/* Template Download Section */}
          <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Download className="h-5 w-5" />
                Download Templates
              </CardTitle>
              <CardDescription className="text-gray-400">
                Download sample templates to understand the required format
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => downloadTemplate('txt')}
                  className="bg-[#2a2a2a] border-[#3f3f3f] text-white hover:bg-[#3a3a3a]"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Text Template
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => downloadTemplate('json')}
                  className="bg-[#2a2a2a] border-[#3f3f3f] text-white hover:bg-[#3a3a3a]"
                >
                  <File className="h-4 w-4 mr-2" />
                  JSON Template
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => downloadTemplate('csv')}
                  className="bg-[#2a2a2a] border-[#3f3f3f] text-white hover:bg-[#3a3a3a]"
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  CSV Template
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* File Upload Section */}
          <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Jobs File
              </CardTitle>
              <CardDescription className="text-gray-400">
                Upload a file containing multiple job postings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-[#3f3f3f] rounded-lg p-6 text-center">
                <input 
                  type="file" 
                  accept=".txt,.json,.csv" 
                  onChange={(e) => {
                    if (e.target.files?.length) {
                      handleFileUpload(e.target.files[0])
                    }
                  }}
                  className="hidden"
                  id="file-upload"
                />
                <label 
                  htmlFor="file-upload" 
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload className="h-8 w-8 text-gray-400" />
                  <span className="text-white">Click to upload or drag and drop</span>
                  <span className="text-sm text-gray-400">TXT, JSON, or CSV files</span>
                </label>
              </div>
              
              {bulkUploadStatus && (
                <div className="p-4 bg-[#2a2a2a] rounded-lg border border-[#3f3f3f]">
                  <p className="text-white">{bulkUploadStatus}</p>
                </div>
              )}

              {uploadedJobs.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-white font-medium">Successfully Uploaded Jobs:</h4>
                  <div className="space-y-1">
                    {uploadedJobs.map((job, index) => (
                      <div key={index} className="p-2 bg-[#2a2a2a] rounded border border-[#3f3f3f]">
                        <span className="text-white">{job.title}</span>
                        <span className="text-gray-400 ml-2">- {job.companyName}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    onClick={() => router.push("/jobs")}
                    className="w-full"
                  >
                    View All Jobs
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Format Instructions */}
          <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
            <CardHeader>
              <CardTitle className="text-white">Format Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-gray-400">
              <div>
                <h4 className="text-white font-medium mb-2">Text Format (.txt):</h4>
                <p>Each job should be separated by "---". Use "Key: Value" format for each field.</p>
              </div>
              <div>
                <h4 className="text-white font-medium mb-2">JSON Format (.json):</h4>
                <p>Array of job objects with all required fields.</p>
              </div>
              <div>
                <h4 className="text-white font-medium mb-2">CSV Format (.csv):</h4>
                <p>First row should contain headers, subsequent rows contain job data.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


