import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CreditCard, Calendar, AlertCircle } from "lucide-react"

export default async function BillingPage() {
  const supabase = createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: userData } = await supabase.from("users").select("plan").eq("id", user.id).single()

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active")
    .single()

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Billing & Subscription</h1>
        <p className="text-gray-600 mt-2">Manage your subscription and billing information</p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={userData?.plan === "premium" ? "default" : "secondary"}>
                  {userData?.plan === "premium" ? "Premium" : "Free"}
                </Badge>
                {userData?.plan === "premium" && (
                  <span className="text-sm text-gray-600">
                    {subscription?.provider === "paystack" ? "₦3,000/month" : "$2/month"}
                  </span>
                )}
              </div>
              <p className="text-gray-600">
                {userData?.plan === "premium"
                  ? "You have access to all premium features"
                  : "Upgrade to unlock all features"}
              </p>
            </div>
            {userData?.plan === "free" && (
              <Button asChild>
                <a href="/dashboard/upgrade">Upgrade Now</a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Subscription Details */}
      {subscription && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Subscription Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Provider</label>
                <p className="text-gray-900 capitalize">{subscription.provider}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <p className="text-gray-900 capitalize">{subscription.status}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Current Period Start</label>
                <p className="text-gray-900">{new Date(subscription.current_period_start).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Current Period End</label>
                <p className="text-gray-900">{new Date(subscription.current_period_end).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Billing Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Important Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Payment Methods</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Nigerian users: Paystack (₦3,000/month)</li>
              <li>• International users: Stripe ($2/month)</li>
            </ul>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Cancellation Policy</h3>
            <p className="text-sm text-gray-700">
              You can cancel your subscription at any time. You'll continue to have access to premium features until the
              end of your current billing period.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
