```tsx file="app/dashboard/page.tsx"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import UpgradeBanner from "@/components/dashboard/upgrade-banner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, Code, FileText, Users, TrendingUp, Newspaper, ArrowRight, Crown, Sparkles } from 'lucide-react'
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = createServerClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile data
  const { data: userProfile } = await supabase.from("users").select("*").eq("id", data.user.id).single()

  const features = [
    {
      title: "Job Search",
      description: userProfile?.plan === "premium" 
        ? "AI-powered job search with Boolean query generation"
        : "Find remote, local, full-time, and part-time opportunities",
      icon: Search,
      href: "/dashboard/jobs",
      available: true,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Boolean Builder",
      description: userProfile?.plan === "premium"
        ? "Unlimited advanced search queries for Google and LinkedIn"
        : "Create advanced search queries for Google and LinkedIn (limited)",
      icon: Code,
      href: "/dashboard/boolean",
      available: true,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Resume Optimizer",
      description: "AI-powered resume scoring and ATS optimization",
      icon: FileText,
      href: "/dashboard/resume",
      available: userProfile?.plan === "premium",
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Lead Generator",
      description: "Find recruiter contacts, emails, and company information",
      icon: Users,
      href: "/dashboard/leads",
      available: userProfile?.plan === "premium",
      color: "bg-orange-50 text-orange-600",
    },
    {
      title: "SEO Tools",
      description: userProfile?.plan === "premium"
        ? "Advanced keyword research with unlimited analyses and export"
        : "Basic keyword research and SEO optimization tools",
      icon: TrendingUp,
      href: "/dashboard/seo",
      available: true,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "Country News",
      description: userProfile?.plan === "premium"
        ? "Unlimited news access with export capabilities"
        : "Stay updated with latest news and trends (limited refreshes)",
      icon: Newspaper,
      href: "/dashboard/news",
      available: true,
      color: "bg-red-50 text-red-600",
    },
  ]

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {userProfile?.name || "User"}!</h1>
        <p className="text-gray-600 mt-2">Your AI-powered job search and career assistant</p>
        <div className="mt-4 flex items-center gap-3">
          <span
            className={\`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              userProfile?.plan === "premium" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"
            }\`}
          >
            {userProfile?.plan === "premium" && <Crown className="h-4 w-4 mr-1" />}
            {userProfile?.plan === "premium" ? "Premium Plan" : "Free Plan"}
          </span>
          <span className="text-sm text-gray-500">
            Member since {new Date(userProfile?.created_at || "").toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Upgrade Banner */}
      <UpgradeBanner userPlan={userProfile?.plan || "free"} />

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Card key={feature.title} className="relative hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className={\`p-2 rounded-lg ${feature.color}\`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-1">
                  {userProfile?.plan === "premium" && feature.available && (
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                  )}
                  {!feature.available && <Crown className="h-5 w-5 text-yellow-500" />}
                </div>
              </div>
              <CardTitle className="text-lg">{feature.title}</CardTitle>
              <CardDescription className="text-balance">{feature.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {feature.available ? (
                <Button asChild className="w-full">
                  <Link href={feature.href}>
                    {userProfile?.plan === "premium" ? "Access Premium" : "Get Started"}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              ) : (
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/dashboard/upgrade">
                    Upgrade to Access
                    <Crown className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Plan Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userProfile?.plan === "premium" ? "Premium" : "Free"}
            </div>
            <p className="text-xs text-gray-500">
              {userProfile?.plan === "premium" ? "All features unlocked" : "Limited features"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Jobs Searched</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-gray-500">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Boolean Queries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-gray-500">Generated</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Resume Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userProfile?.plan === "premium" ? "--" : "Upgrade"}</div>
            <p className="text-xs text-gray-500">
              {userProfile?.plan === "premium" ? "Not analyzed yet" : "Premium feature"}
            </p>
          </CardContent>
        </Card>
      </div>

      {userProfile?.plan === "premium" && (
        <div className="mt-12">
          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800">
                <Crown className="h-5 w-5" />
                Premium Features Active
              </CardTitle>
              <CardDescription className="text-yellow-700">
                You have access to all premium features including export capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-medium text-yellow-800">AI-Powered Tools</h4>
                  <ul className="text-yellow-700 space-y-1">
                    <li>• Advanced job search with Boolean queries</li>
                    <li>• Resume optimizer with ATS scoring</li>
                    <li>• Lead generator with contact details</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-yellow-800">Export & Analytics</h4>
                  <ul className="text-yellow-700 space-y-1">
                    <li>• Export jobs, leads, and news to Excel/PDF</li>
                    <li>• Unlimited keyword research</li>
                    <li>• Advanced SEO metrics and insights</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
