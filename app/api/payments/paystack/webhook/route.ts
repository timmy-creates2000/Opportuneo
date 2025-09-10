import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("x-paystack-signature")

    if (!signature) {
      return NextResponse.json({ error: "No signature provided" }, { status: 400 })
    }

    // Verify webhook signature
    const hash = crypto.createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!).update(body).digest("hex")

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const event = JSON.parse(body)

    if (event.event === "charge.success") {
      const { customer, metadata } = event.data
      const userId = metadata.user_id

      if (!userId) {
        return NextResponse.json({ error: "No user ID in metadata" }, { status: 400 })
      }

      const supabase = createServerClient()

      // Update user plan to premium
      const { error: userError } = await supabase.from("users").update({ plan: "premium" }).eq("id", userId)

      if (userError) {
        console.error("Error updating user plan:", userError)
        return NextResponse.json({ error: "Failed to update user plan" }, { status: 500 })
      }

      // Create subscription record
      const { error: subError } = await supabase.from("subscriptions").insert({
        user_id: userId,
        provider: "paystack",
        provider_subscription_id: event.data.reference,
        status: "active",
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      })

      if (subError) {
        console.error("Error creating subscription:", subError)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
