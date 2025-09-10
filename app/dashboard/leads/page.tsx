"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Users, Search, Mail, Globe, Building, Sparkles } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import ExportButtons from "@/components/export/export-buttons"
import { exportLeadsToExcel, exportLeadsToPDF } from "@/lib/export-utils"

interface Lead {
  id: string
  name: string
  title: string
  company: string
  email: string
  website: string
  linkedin: string
  industry: string
}

export default function LeadGeneratorPage() {
  const [company, setCompany] = useState("")
  const [industry, setIndustry] = useState("")
  const [role, setRole] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [leads, setLeads] = useState<Lead[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [userPlan, setUserPlan] = useState<string>("free")
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

  const mockLeads: Lead[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      title: "Head of Engineering",
      company: "TechCorp Nigeria",
      email: "sarah.johnson@techcorp.ng",
      website: "https://techcorp.ng",
      linkedin: "https://linkedin.com/in/sarahjohnson",
      industry: "Technology",
    },
    {
      id: "2",
      name: "Michael Chen",
      title: "Senior Recruiter",
      company: "Global Talent Solutions",
      email: "m.chen@globaltalent.com",
      website: "https://globaltalent.com",
      linkedin: "https://linkedin.com/in/michaelchen",
      industry: "Recruitment",
    },
    {
      id: "3",
      name: "Aisha Okafor",
      title: "HR Director",
      company: "Fintech Innovations",
      email: "aisha@fintechinnovations.com",
      website: "https://fintechinnovations.com",
      linkedin: "https://linkedin.com/in/aishaokafor",
      industry: "Financial Services",
    },
  ]

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (userPlan === "free") {
      router.push("/dashboard/upgrade")
      return
    }

    setIsSearching(true)
    setHasSearched(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Filter mock leads based on search criteria
    let filteredLeads = mockLeads

    if (company) {
      filteredLeads = filteredLeads.filter((lead) => lead.company.toLowerCase().includes(company.toLowerCase()))
    }

    if (industry) {
      filteredLeads = filteredLeads.filter((lead) => lead.industry.toLowerCase().includes(industry.toLowerCase()))
    }

    if (role) {
      filteredLeads = filteredLeads.filter((lead) => lead.title.toLowerCase().includes(role.toLowerCase()))
    }

    setLeads(filteredLeads)
    setIsSearching(false)
  }

  const handleExportExcel = () => {
    exportLeadsToExcel(leads, `leads-${new Date().toISOString().split("T")[0]}.xlsx`)
  }

  const handleExportPDF = () => {
    exportLeadsToPDF(leads, `leads-${new Date().toISOString().split("T")[0]}.pdf`)
  }

  if (userPlan === "free") {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lead Generator</h1>
          <p className="text-gray-600 mt-2">Find recruiter contacts and decision makers</p>
        </div>

        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-8 text-center">
            <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-4">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Feature</h3>
            <p className="text-gray-600 mb-6">
              Generate high-quality leads including recruiter emails, company websites, and decision maker contacts to
              accelerate your job search and networking efforts.
            </p>
            <Button
              asChild
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              <a href="/dashboard/upgrade">
                <Sparkles className="h-4 w-4 mr-2" />
                Upgrade to Premium
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Lead Generator</h1>
        <p className="text-gray-600 mt-2">Find recruiter contacts and decision makers</p>
      </div>

      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Generate Leads
          </CardTitle>
          <CardDescription>
            Search for recruiters, HR professionals, and decision makers in your target companies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  type="text"
                  placeholder="e.g. Google, Microsoft"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role/Title</Label>
                <Input
                  id="role"
                  type="text"
                  placeholder="e.g. Recruiter, HR Manager"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>
            </div>

            <Button type="submit" disabled={isSearching}>
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating Leads...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Generate Leads
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {hasSearched && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {leads.length} Lead{leads.length !== 1 ? "s" : ""} Found
            </h2>
            {leads.length > 0 && (
              <ExportButtons onExportExcel={handleExportExcel} onExportPDF={handleExportPDF} label="Export Leads" />
            )}
          </div>

          {leads.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
                <p className="text-gray-600">Try adjusting your search criteria</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {leads.map((lead) => (
                <Card key={lead.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{lead.name}</h3>
                        <p className="text-gray-600">{lead.title}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Building className="h-4 w-4 text-gray-500" />
                          <span>{lead.company}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline">
                            {lead.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Globe className="h-4 w-4 text-gray-500" />
                          <a
                            href={lead.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Company Website
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{lead.industry}</Badge>
                        <Button asChild variant="outline" size="sm">
                          <a href={lead.linkedin} target="_blank" rel="noopener noreferrer">
                            LinkedIn
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
