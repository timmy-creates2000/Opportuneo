"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Clock, Building, ExternalLink, Briefcase } from "lucide-react"
import ExportButtons from "@/components/export/export-buttons"
import { exportJobsToExcel, exportJobsToPDF } from "@/lib/export-utils"

interface Job {
  id: string
  title: string
  company: string
  location: string
  type: string
  posted: string
  description: string
  url: string
}

export default function JobSearchPage() {
  const [keyword, setKeyword] = useState("")
  const [location, setLocation] = useState("")
  const [jobType, setJobType] = useState("all")
  const [isSearching, setIsSearching] = useState(false)
  const [jobs, setJobs] = useState<Job[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [userPlan, setUserPlan] = useState<string>("free")
  const [booleanQuery, setBooleanQuery] = useState("")
  const router = useRouter()
  const supabase = createBrowserClient()

  useEffect(() => {
    const checkUserPlan = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data: userData } = await supabase.from("users").select("plan").eq("id", user.id).single()

      if (userData) {
        setUserPlan(userData.plan)
      }
    }

    checkUserPlan()
  }, [supabase, router])

  useEffect(() => {
    if (userPlan === "premium" && (keyword || location)) {
      const parts = []
      if (keyword) parts.push(`"${keyword}"`)
      if (location) parts.push(`"${location}"`)
      if (jobType !== "all") parts.push(`"${jobType}"`)

      const query = parts.join(" AND ") + " site:linkedin.com OR site:indeed.com"
      setBooleanQuery(query)
    }
  }, [keyword, location, jobType, userPlan])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)
    setHasSearched(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Filter mock jobs based on search criteria
    let filteredJobs = mockJobs

    if (keyword) {
      filteredJobs = filteredJobs.filter(
        (job) =>
          job.title.toLowerCase().includes(keyword.toLowerCase()) ||
          job.description.toLowerCase().includes(keyword.toLowerCase()),
      )
    }

    if (location) {
      filteredJobs = filteredJobs.filter((job) => job.location.toLowerCase().includes(location.toLowerCase()))
    }

    if (jobType !== "all") {
      filteredJobs = filteredJobs.filter((job) => job.type.toLowerCase() === jobType.toLowerCase())
    }

    setJobs(filteredJobs)
    setIsSearching(false)
  }

  const handleExportExcel = () => {
    exportJobsToExcel(jobs, `jobs-${new Date().toISOString().split("T")[0]}.xlsx`)
  }

  const handleExportPDF = () => {
    exportJobsToPDF(jobs, `jobs-${new Date().toISOString().split("T")[0]}.pdf`)
  }

  // Mock job data for demonstration
  const mockJobs: Job[] = [
    {
      id: "1",
      title: "Frontend Developer",
      company: "TechCorp Nigeria",
      location: "Lagos, Nigeria",
      type: "Full-time",
      posted: "2 days ago",
      description:
        "We are looking for a skilled Frontend Developer to join our team. Experience with React, TypeScript, and modern web technologies required.",
      url: "https://example.com/job1",
    },
    {
      id: "2",
      title: "Remote Software Engineer",
      company: "Global Tech Solutions",
      location: "Remote",
      type: "Full-time",
      posted: "1 week ago",
      description:
        "Join our remote team as a Software Engineer. Work with cutting-edge technologies and collaborate with international teams.",
      url: "https://example.com/job2",
    },
    {
      id: "3",
      title: "UI/UX Designer",
      company: "Creative Agency",
      location: "Abuja, Nigeria",
      type: "Part-time",
      posted: "3 days ago",
      description:
        "Looking for a creative UI/UX Designer to help design beautiful and functional user interfaces for our clients.",
      url: "https://example.com/job3",
    },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Job Search</h1>
        <p className="text-gray-600 mt-2">
          {userPlan === "premium"
            ? "Advanced AI-powered job search with Boolean query generation"
            : "Find your next opportunity with our basic job search tool"}
        </p>
      </div>

      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Jobs
            {userPlan === "premium" && <Badge className="ml-2">Premium</Badge>}
          </CardTitle>
          <CardDescription>Enter keywords and location to find relevant job opportunities</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="keyword">Job Title or Keywords</Label>
                <Input
                  id="keyword"
                  type="text"
                  placeholder="e.g. Frontend Developer, React, JavaScript"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="e.g. Lagos, Remote, Nigeria"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="jobType">Job Type</Label>
                <Select value={jobType} onValueChange={setJobType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {userPlan === "premium" && booleanQuery && (
              <div className="space-y-2">
                <Label>Auto-Generated Boolean Query</Label>
                <div className="bg-gray-50 p-3 rounded-md border">
                  <code className="text-sm text-gray-700">{booleanQuery}</code>
                </div>
                <p className="text-xs text-gray-600">
                  This optimized search query will be used across multiple job platforms
                </p>
              </div>
            )}

            <Button type="submit" className="w-full md:w-auto" disabled={isSearching}>
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {userPlan === "premium" ? "AI Searching..." : "Searching..."}
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  {userPlan === "premium" ? "AI Search Jobs" : "Search Jobs"}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Search Results */}
      {hasSearched && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {jobs.length} Job{jobs.length !== 1 ? "s" : ""} Found
            </h2>
            <div className="flex items-center gap-4">
              {jobs.length > 0 && (
                <p className="text-sm text-gray-600">
                  Showing results for "{keyword}" {location && `in ${location}`}
                </p>
              )}
              {jobs.length > 0 && userPlan === "premium" && (
                <ExportButtons onExportExcel={handleExportExcel} onExportPDF={handleExportPDF} label="Export Jobs" />
              )}
            </div>
          </div>

          {jobs.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or keywords</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{job.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Building className="h-4 w-4" />
                            {job.company}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {job.posted}
                          </div>
                        </div>
                        <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{job.type}</Badge>
                        </div>
                      </div>
                      <Button asChild variant="outline" className="ml-4 bg-transparent">
                        <a href={job.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Job
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tier Notice */}
      <Card className={userPlan === "premium" ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200"}>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${userPlan === "premium" ? "bg-green-100" : "bg-blue-100"}`}>
              <Search className={`h-5 w-5 ${userPlan === "premium" ? "text-green-600" : "text-blue-600"}`} />
            </div>
            <div>
              {userPlan === "premium" ? (
                <>
                  <h4 className="font-medium text-green-900">Premium Features Active</h4>
                  <p className="text-sm text-green-700">
                    AI-powered search with Boolean query generation and unlimited searches enabled.
                  </p>
                </>
              ) : (
                <>
                  <h4 className="font-medium text-blue-900">Free Tier Limitations</h4>
                  <p className="text-sm text-blue-700">
                    Upgrade to Premium for advanced AI-powered job matching, unlimited searches, and export
                    functionality.
                  </p>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
