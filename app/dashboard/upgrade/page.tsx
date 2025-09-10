import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Crown, Sparkles } from "lucide-react"
import PaystackButton from "@/components/payment/paystack-button"
import StripeButton from "@/components/payment/stripe-button"

export default async function UpgradePage() {
  const supabase = createServerClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile data
  const { data: userProfile } = await supabase.from("users").select("*").eq("id", data.user.id).single()

  // If user is already premium, redirect to dashboard
  if (userProfile?.plan === "premium") {
    redirect("/dashboard?already_premium=true")
  }

  const features = {
    free: ["Basic Job Search", "Boolean Search Builder (Limited)", "SEO Keyword Tool (Basic)", "Country News (Basic)"],
    premium: [
      "Advanced Job Search with AI",
      "Unlimited Boolean Search Builder",
      "Resume Optimizer with AI Scoring",
      "Lead Generator (Emails & Contacts)",
      "Export to Excel and PDF",
      "Advanced SEO Tools",
      "Country News with Export",
      "Priority Support",
    ],
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Upgrade to Premium</h1>
        <p className="text-xl text-gray-600">Unlock the full power of Opportuneo's AI-driven job search tools</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Free Plan */}
        <Card className="relative">
          <CardHeader>
            <CardTitle className="text-2xl">Free Plan</CardTitle>
            <CardDescription>Perfect for getting started</CardDescription>
            <div className="text-3xl font-bold text-gray-900">$0</div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              {features.free.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full bg-transparent" disabled>
              Current Plan
            </Button>
          </CardContent>
        </Card>

        {/* Premium Plan */}
        <Card className="relative border-2 border-blue-500 shadow-lg">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
              <Crown className="h-4 w-4" />
              Most Popular
            </div>
          </div>
          <CardHeader className="pt-8">
            <CardTitle className="text-2xl flex items-center gap-2">
              Premium Plan
              <Sparkles className="h-6 w-6 text-yellow-500" />
            </CardTitle>
            <CardDescription>Everything you need to land your dream job</CardDescription>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold text-gray-900">₦3,000</div>
              <div className="text-gray-600">/month</div>
            </div>
            <div className="text-sm text-gray-500">or $2/month for international users</div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              {features.premium.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            <div className="space-y-3">
              <PaystackButton userId={data.user.id} userEmail={data.user.email || ""} />
              <StripeButton userId={data.user.id} userEmail={data.user.email || ""} />
            </div>
            <p className="text-xs text-gray-500 text-center">Cancel anytime. No hidden fees.</p>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Can I cancel anytime?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Yes, you can cancel your subscription at any time. You'll continue to have access to premium features
                until the end of your billing period.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                We accept Paystack for Nigerian users (₦3,000/month) and Stripe for international users ($2/month).
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Is there a free trial?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                You can use our free plan indefinitely with basic features. Upgrade anytime to access premium features.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How does the AI resume optimizer work?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Our AI analyzes your resume for ATS compatibility, keyword optimization, and provides actionable
                suggestions to improve your chances of getting interviews.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
