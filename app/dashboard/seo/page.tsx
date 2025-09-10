"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Search, BarChart3, Crown } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import ExportButtons from "@/components/export/export-buttons"
import { exportSEOToExcel, exportSEOToPDF } from "@/lib/export-utils"

interface KeywordData {
  keyword: string
  volume: number
  difficulty: string
  cpc: string
  competition: string
}

export default function SEOToolsPage() {
  const [keyword, setKeyword] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [keywords, setKeywords] = useState<KeywordData[]>([])
  const [hasAnalyzed, setHasAnalyzed] = useState(false)
  const [analysisCount, setAnalysisCount] = useState(0)
  const [userPlan, setUserPlan] = useState<string>("free")
  const router = useRouter()
  const supabase = createBrowserClient()

  const maxFreeAnalyses = 3

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

  // Mock keyword data for demonstration
  const generateMockKeywords = (baseKeyword: string): KeywordData[] => {
    const variations = [
      baseKeyword,
      `${baseKeyword} jobs`,
      `${baseKeyword} career`,
      `${baseKeyword} salary`,
      `${baseKeyword} skills`,
      `best ${baseKeyword}`,
      `${baseKeyword} training`,
      `${baseKeyword} course`,
    ]

    return variations.map((kw) => ({
      keyword: kw,
      volume: Math.floor(Math.random() * 10000 + 100),
      difficulty: ["Low", "Medium", "High"][Math.floor(Math.random() * 3)],
      cpc: `$${(Math.random() * 5 + 0.5).toFixed(2)}`,
      competition: ["Low", "Medium", "High"][Math.floor(Math.random() * 3)],
    }))
  }

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()

    if (userPlan === "free" && analysisCount >= maxFreeAnalyses) {
      return
    }

    setIsAnalyzing(true)
    setHasAnalyzed(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockKeywords = generateMockKeywords(keyword)
    setKeywords(mockKeywords)

    if (userPlan === "free") {
      setAnalysisCount((prev) => prev + 1)
    }
    setIsAnalyzing(false)
  }

  const handleExportExcel = () => {
    exportSEOToExcel(keywords, `seo-keywords-${keyword}-${new Date().toISOString().split("T")[0]}.xlsx`)
  }

  const handleExportPDF = () => {
    exportSEOToPDF(keywords, `seo-keywords-${keyword}-${new Date().toISOString().split("T")[0]}.pdf`)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Low":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "High":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">SEO Keyword Tools</h1>
        <p className="text-gray-600 mt-2">
          {userPlan === "premium"
            ? "Advanced keyword research with unlimited analyses and export capabilities"
            : "Research keywords and analyze search trends for your job search content"}
        </p>
      </div>

      {/* Keyword Research Tool */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Keyword Research
            {userPlan === "premium" && <Badge className="ml-2">Premium</Badge>}
          </CardTitle>
          <CardDescription>Enter a keyword to discover related terms and search volumes</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="keyword">Seed Keyword</Label>
                <Input
                  id="keyword"
                  type="text"
                  placeholder="e.g. software developer, digital marketing"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              {userPlan === "free" && (
                <div className="text-sm text-gray-600">
                  Analyses used: {analysisCount}/{maxFreeAnalyses} (Free tier)
                </div>
              )}
              <Button type="submit" disabled={isAnalyzing || (userPlan === "free" && analysisCount >= maxFreeAnalyses)}>
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    {userPlan === "premium" ? "Advanced Analysis" : "Analyze Keywords"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {hasAnalyzed && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Keyword Analysis Results</h2>
            <div className="flex items-center gap-4">
              {keywords.length > 0 && <p className="text-sm text-gray-600">Found {keywords.length} related keywords</p>}
              {keywords.length > 0 && userPlan === "premium" && (
                <ExportButtons
                  onExportExcel={handleExportExcel}
                  onExportPDF={handleExportPDF}
                  label="Export Keywords"
                />
              )}
            </div>
          </div>

          {keywords.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600">Try a different keyword or check your spelling</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Keyword Suggestions</CardTitle>
                <CardDescription>
                  {userPlan === "premium"
                    ? "Advanced keyword data with search volume, difficulty, CPC, and competition metrics"
                    : "Related keywords with search volume and difficulty estimates"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Keyword</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Monthly Volume</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Difficulty</th>
                        {userPlan === "premium" && (
                          <>
                            <th className="text-left py-3 px-4 font-medium text-gray-900">CPC</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900">Competition</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {keywords.map((kw, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-900">{kw.keyword}</td>
                          <td className="py-3 px-4 text-gray-600">{kw.volume.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <Badge className={getDifficultyColor(kw.difficulty)}>{kw.difficulty}</Badge>
                          </td>
                          {userPlan === "premium" && (
                            <>
                              <td className="py-3 px-4 text-gray-600">{kw.cpc}</td>
                              <td className="py-3 px-4">
                                <Badge className={getDifficultyColor(kw.competition)}>{kw.competition}</Badge>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* SEO Tips */}
      <Card>
        <CardHeader>
          <CardTitle>SEO Tips for Job Seekers</CardTitle>
          <CardDescription>Optimize your online presence for better visibility</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">LinkedIn Optimization</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Use relevant keywords in your headline</li>
                <li>• Include industry terms in your summary</li>
                <li>• Optimize your skills section</li>
                <li>• Use keywords in job descriptions</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Resume SEO</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Include job-specific keywords</li>
                <li>• Use industry terminology</li>
                <li>• Match job posting language</li>
                <li>• Include relevant certifications</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tier Notice */}
      <Card className={userPlan === "premium" ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200"}>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${userPlan === "premium" ? "bg-green-100" : "bg-blue-100"}`}>
              <Crown className={`h-5 w-5 ${userPlan === "premium" ? "text-green-600" : "text-blue-600"}`} />
            </div>
            <div>
              {userPlan === "premium" ? (
                <>
                  <h4 className="font-medium text-green-900">Premium Features Active</h4>
                  <p className="text-sm text-green-700">
                    Unlimited keyword analyses, advanced metrics (CPC, competition), and export functionality enabled.
                  </p>
                </>
              ) : (
                <>
                  <h4 className="font-medium text-blue-900">Free Tier Limitations</h4>
                  <p className="text-sm text-blue-700">
                    Limited to {maxFreeAnalyses} keyword analyses. Upgrade to Premium for unlimited research, competitor
                    analysis, and advanced SEO tools.
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
