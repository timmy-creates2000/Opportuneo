import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const reference = searchParams.get("reference")

  if (!reference) {
    return NextResponse.redirect(new URL("/dashboard/upgrade?error=invalid_reference", request.url))
  }

  try {
    // Verify payment with Paystack
    const verifyResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    })

    const verifyData = await verifyResponse.json()

    if (verifyData.status && verifyData.data.status === "success") {
      const { metadata } = verifyData.data
      const userId = metadata.userId

      // Update user subscription in database
      const supabase = await createClient()

      // Create subscription record
      await supabase.from("subscriptions").insert({
        user_id: userId,
        plan: "premium",
        status: "active",
        provider: "paystack",
        provider_subscription_id: reference,
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      })

      return NextResponse.redirect(new URL("/dashboard?upgrade=success", request.url))
    } else {
      return NextResponse.redirect(new URL("/dashboard/upgrade?error=payment_failed", request.url))
    }
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.redirect(new URL("/dashboard/upgrade?error=verification_failed", request.url))
  }
}
