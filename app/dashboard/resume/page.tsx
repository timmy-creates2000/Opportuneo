"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FileText, Sparkles, CheckCircle, AlertCircle, XCircle } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface ResumeAnalysis {
  score: number
  strengths: string[]
  improvements: string[]
  keywords: string[]
  atsCompatibility: number
}

export default function ResumeOptimizerPage() {
  const [resumeText, setResumeText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null)
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

  const handleAnalyze = async () => {
    if (userPlan === "free") {
      router.push("/dashboard/upgrade")
      return
    }

    setIsAnalyzing(true)

    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Mock analysis results
    const mockAnalysis: ResumeAnalysis = {
      score: 78,
      strengths: [
        "Strong technical skills section",
        "Quantified achievements with metrics",
        "Clear professional summary",
        "Relevant work experience",
      ],
      improvements: [
        "Add more action verbs to job descriptions",
        "Include industry-specific keywords",
        "Optimize formatting for ATS systems",
        "Add relevant certifications section",
      ],
      keywords: ["JavaScript", "React", "Node.js", "Python", "AWS", "Docker", "Agile"],
      atsCompatibility: 85,
    }

    setAnalysis(mockAnalysis)
    setIsAnalyzing(false)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-600" />
    if (score >= 60) return <AlertCircle className="h-5 w-5 text-yellow-600" />
    return <XCircle className="h-5 w-5 text-red-600" />
  }

  if (userPlan === "free") {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resume Optimizer</h1>
          <p className="text-gray-600 mt-2">AI-powered resume analysis and optimization</p>
        </div>

        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="p-8 text-center">
            <div className="bg-purple-100 p-3 rounded-full w-fit mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Feature</h3>
            <p className="text-gray-600 mb-6">
              The Resume Optimizer uses advanced AI to analyze your resume for ATS compatibility, keyword optimization,
              and provides actionable suggestions to improve your chances of getting interviews.
            </p>
            <Button
              asChild
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
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
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Resume Optimizer</h1>
        <p className="text-gray-600 mt-2">AI-powered resume analysis and optimization</p>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Upload Your Resume
          </CardTitle>
          <CardDescription>
            Paste your resume text below for AI-powered analysis and optimization suggestions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resume">Resume Content</Label>
            <Textarea
              id="resume"
              placeholder="Paste your resume content here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="min-h-[200px]"
            />
          </div>
          <Button onClick={handleAnalyze} disabled={!resumeText.trim() || isAnalyzing} className="w-full md:w-auto">
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analyzing Resume...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Analyze Resume
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Overall Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getScoreIcon(analysis.score)}
                Resume Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className={`text-3xl font-bold ${getScoreColor(analysis.score)}`}>{analysis.score}/100</div>
                <div className="flex-1">
                  <Progress value={analysis.score} className="h-3" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">ATS Compatibility</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={analysis.atsCompatibility} className="h-2 flex-1" />
                    <span className="text-sm font-medium">{analysis.atsCompatibility}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Strengths */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-5 w-5" />
                Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Improvements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <AlertCircle className="h-5 w-5" />
                Suggested Improvements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{improvement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Keywords */}
          <Card>
            <CardHeader>
              <CardTitle>Detected Keywords</CardTitle>
              <CardDescription>
                These keywords were found in your resume and are relevant to your industry
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {analysis.keywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
