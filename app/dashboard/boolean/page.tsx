"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Code, Copy, Lightbulb, ExternalLink, Crown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function BooleanBuilderPage() {
  const [keywords, setKeywords] = useState("")
  const [location, setLocation] = useState("")
  const [excludeWords, setExcludeWords] = useState("")
  const [site, setSite] = useState("")
  const [booleanQuery, setBooleanQuery] = useState("")
  const [queryCount, setQueryCount] = useState(0)
  const { toast } = useToast()

  const maxFreeQueries = 5

  const generateBooleanQuery = () => {
    if (queryCount >= maxFreeQueries) {
      toast({
        title: "Free limit reached",
        description: "Upgrade to Premium for unlimited Boolean queries",
        variant: "destructive",
      })
      return
    }

    let query = ""

    // Process keywords
    if (keywords.trim()) {
      const keywordList = keywords
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k)
      if (keywordList.length > 1) {
        query += `(${keywordList.map((k) => `"${k}"`).join(" OR ")})`
      } else {
        query += `"${keywordList[0]}"`
      }
    }

    // Add location
    if (location.trim()) {
      if (query) query += " AND "
      query += `"${location.trim()}"`
    }

    // Add exclusions
    if (excludeWords.trim()) {
      const excludeList = excludeWords
        .split(",")
        .map((e) => e.trim())
        .filter((e) => e)
      excludeList.forEach((word) => {
        query += ` -"${word}"`
      })
    }

    // Add site filter
    if (site.trim()) {
      query += ` site:${site.trim()}`
    }

    setBooleanQuery(query)
    setQueryCount((prev) => prev + 1)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(booleanQuery)
      toast({
        title: "Copied!",
        description: "Boolean query copied to clipboard",
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the query manually",
        variant: "destructive",
      })
    }
  }

  const examples = [
    {
      title: "Software Developer in Lagos",
      input: 'Keywords: "software developer", "frontend developer"\nLocation: Lagos\nSite: linkedin.com',
      output: '("software developer" OR "frontend developer") AND "Lagos" site:linkedin.com',
    },
    {
      title: "Remote Marketing Jobs",
      input: 'Keywords: "marketing manager", "digital marketing"\nLocation: remote\nExclude: intern, junior',
      output: '("marketing manager" OR "digital marketing") AND "remote" -"intern" -"junior"',
    },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Boolean Search Builder</h1>
        <p className="text-gray-600 mt-2">Create advanced search queries for Google, LinkedIn, and other job boards</p>
      </div>

      {/* Query Builder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Build Your Query
          </CardTitle>
          <CardDescription>Enter your search criteria and we'll generate a Boolean query for you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords (comma-separated)</Label>
              <Input
                id="keywords"
                placeholder="e.g. software developer, frontend developer"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
              <p className="text-xs text-gray-500">Separate multiple keywords with commas</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g. Lagos, Remote, Nigeria"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="exclude">Exclude Words (comma-separated)</Label>
              <Input
                id="exclude"
                placeholder="e.g. intern, junior, unpaid"
                value={excludeWords}
                onChange={(e) => setExcludeWords(e.target.value)}
              />
              <p className="text-xs text-gray-500">Words to exclude from results</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="site">Site Filter (optional)</Label>
              <Input
                id="site"
                placeholder="e.g. linkedin.com, indeed.com"
                value={site}
                onChange={(e) => setSite(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="text-sm text-gray-600">
              Queries used: {queryCount}/{maxFreeQueries} (Free tier)
            </div>
            <Button onClick={generateBooleanQuery} disabled={!keywords.trim() || queryCount >= maxFreeQueries}>
              <Code className="h-4 w-4 mr-2" />
              Generate Query
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Query */}
      {booleanQuery && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Boolean Query</CardTitle>
            <CardDescription>Copy this query and use it in Google, LinkedIn, or other search engines</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <code className="text-sm font-mono text-gray-800 break-all">{booleanQuery}</code>
            </div>
            <div className="flex gap-2">
              <Button onClick={copyToClipboard} variant="outline">
                <Copy className="h-4 w-4 mr-2" />
                Copy Query
              </Button>
              <Button asChild variant="outline">
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(booleanQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Search Google
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Examples */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Examples
          </CardTitle>
          <CardDescription>See how different inputs create Boolean queries</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {examples.map((example, index) => (
            <div key={index} className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">{example.title}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Input:</Label>
                  <pre className="text-xs bg-gray-50 p-2 rounded mt-1 whitespace-pre-wrap">{example.input}</pre>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Output:</Label>
                  <code className="text-xs bg-blue-50 p-2 rounded mt-1 block break-all">{example.output}</code>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Free Tier Limitation */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-2 rounded-full">
              <Crown className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <h4 className="font-medium text-yellow-900">Free Tier Limitations</h4>
              <p className="text-sm text-yellow-700">
                Limited to {maxFreeQueries} queries. Upgrade to Premium for unlimited Boolean query generation and
                advanced features.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
