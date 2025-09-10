"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Newspaper, ExternalLink, Clock, Globe, Crown, RefreshCw } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import ExportButtons from "@/components/export/export-buttons"
import { exportNewsToExcel, exportNewsToPDF } from "@/lib/export-utils"

interface NewsArticle {
  id: string
  title: string
  description: string
  url: string
  source: string
  publishedAt: string
  category: string
  country: string
}

export default function CountryNewsPage() {
  const [selectedCountry, setSelectedCountry] = useState("nigeria")
  const [selectedCategory, setSelectedCategory] = useState("business")
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [refreshCount, setRefreshCount] = useState(0)
  const [userPlan, setUserPlan] = useState<string>("free")
  const router = useRouter()
  const supabase = createBrowserClient()

  const maxFreeRefreshes = 10

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

  // Mock news data for demonstration
  const mockArticles: NewsArticle[] = [
    {
      id: "1",
      title: "Nigeria's Tech Sector Shows Strong Growth in Q4 2024",
      description:
        "The technology sector in Nigeria continues to attract significant investment, with fintech and e-commerce leading the charge.",
      url: "https://example.com/news1",
      source: "TechPoint Africa",
      publishedAt: "2024-01-15T10:30:00Z",
      category: "business",
      country: "nigeria",
    },
    {
      id: "2",
      title: "New Government Initiative to Boost Youth Employment",
      description:
        "The federal government announces a new program aimed at creating 500,000 jobs for young Nigerians in the next two years.",
      url: "https://example.com/news2",
      source: "Premium Times",
      publishedAt: "2024-01-14T14:20:00Z",
      category: "business",
      country: "nigeria",
    },
    {
      id: "3",
      title: "Remote Work Trends Reshape Nigerian Job Market",
      description:
        "A new study reveals how remote work opportunities are changing the employment landscape in Nigeria.",
      url: "https://example.com/news3",
      source: "BusinessDay",
      publishedAt: "2024-01-13T09:15:00Z",
      category: "business",
      country: "nigeria",
    },
    {
      id: "4",
      title: "Skills Gap Analysis: What Nigerian Employers Want",
      description:
        "Latest research shows the most in-demand skills in the Nigerian job market and how job seekers can bridge the gap.",
      url: "https://example.com/news4",
      source: "Jobberman",
      publishedAt: "2024-01-12T16:45:00Z",
      category: "business",
      country: "nigeria",
    },
  ]

  const countries = [
    { value: "nigeria", label: "Nigeria" },
    { value: "ghana", label: "Ghana" },
    { value: "kenya", label: "Kenya" },
    { value: "south-africa", label: "South Africa" },
    { value: "egypt", label: "Egypt" },
  ]

  const categories = [
    { value: "business", label: "Business & Economy" },
    { value: "technology", label: "Technology" },
    { value: "general", label: "General News" },
  ]

  const fetchNews = async () => {
    if (userPlan === "free" && refreshCount >= maxFreeRefreshes) {
      return
    }

    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Filter mock articles based on selection
    const filteredArticles = mockArticles.filter(
      (article) => article.country === selectedCountry && article.category === selectedCategory,
    )

    setArticles(filteredArticles)
    if (userPlan === "free") {
      setRefreshCount((prev) => prev + 1)
    }
    setIsLoading(false)
  }

  const handleExportExcel = () => {
    exportNewsToExcel(articles, `news-${selectedCountry}-${new Date().toISOString().split("T")[0]}.xlsx`)
  }

  const handleExportPDF = () => {
    exportNewsToPDF(articles, `news-${selectedCountry}-${new Date().toISOString().split("T")[0]}.pdf`)
  }

  useEffect(() => {
    fetchNews()
  }, [selectedCountry, selectedCategory])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Country News</h1>
        <p className="text-gray-600 mt-2">
          {userPlan === "premium"
            ? "Stay updated with unlimited news access and export capabilities"
            : "Stay updated with the latest news and trends from different countries"}
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            News Filters
            {userPlan === "premium" && <Badge className="ml-2">Premium</Badge>}
          </CardTitle>
          <CardDescription>Select country and category to customize your news feed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Country</label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              {userPlan === "free" && (
                <div className="text-sm text-gray-600">
                  Refreshes: {refreshCount}/{maxFreeRefreshes}
                </div>
              )}
              <Button
                onClick={fetchNews}
                disabled={isLoading || (userPlan === "free" && refreshCount >= maxFreeRefreshes)}
                variant="outline"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* News Articles */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Latest Headlines</h2>
          <div className="flex items-center gap-4">
            <Badge variant="outline">
              {countries.find((c) => c.value === selectedCountry)?.label} •{" "}
              {categories.find((c) => c.value === selectedCategory)?.label}
            </Badge>
            {articles.length > 0 && userPlan === "premium" && (
              <ExportButtons onExportExcel={handleExportExcel} onExportPDF={handleExportPDF} label="Export News" />
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600">Try selecting a different country or category</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {articles.map((article) => (
              <Card key={article.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{article.title}</h3>
                      <p className="text-gray-700 mb-4 line-clamp-2">{article.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Newspaper className="h-4 w-4" />
                          {article.source}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatDate(article.publishedAt)}
                        </div>
                      </div>
                    </div>
                    <Button asChild variant="outline" className="ml-4 shrink-0 bg-transparent">
                      <a href={article.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Read More
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

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
                    Unlimited news refreshes, export functionality, and custom alerts enabled.
                  </p>
                </>
              ) : (
                <>
                  <h4 className="font-medium text-blue-900">Free Tier Limitations</h4>
                  <p className="text-sm text-blue-700">
                    Limited to {maxFreeRefreshes} news refreshes. Upgrade to Premium for unlimited access, news export,
                    and custom alerts.
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
