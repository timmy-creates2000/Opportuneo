import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")

    if (!signature) {
      return NextResponse.json({ error: "No signature provided" }, { status: 400 })
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const supabase = createServerClient()

    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.user_id

        if (!userId) {
          return NextResponse.json({ error: "No user ID in metadata" }, { status: 400 })
        }

        // Update user plan to premium
        const { error: userError } = await supabase.from("users").update({ plan: "premium" }).eq("id", userId)

        if (userError) {
          console.error("Error updating user plan:", userError)
          return NextResponse.json({ error: "Failed to update user plan" }, { status: 500 })
        }

        // Create subscription record
        const { error: subError } = await supabase.from("subscriptions").insert({
          user_id: userId,
          provider: "stripe",
          provider_subscription_id: session.subscription as string,
          status: "active",
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        })

        if (subError) {
          console.error("Error creating subscription:", subError)
        }
        break

      case "customer.subscription.deleted":
        const subscription = event.data.object as Stripe.Subscription

        // Update subscription status to cancelled
        const { error: cancelError } = await supabase
          .from("subscriptions")
          .update({ status: "cancelled" })
          .eq("provider_subscription_id", subscription.id)

        // Update user plan back to free
        const { data: subData } = await supabase
          .from("subscriptions")
          .select("user_id")
          .eq("provider_subscription_id", subscription.id)
          .single()

        if (subData) {
          await supabase.from("users").update({ plan: "free" }).eq("id", subData.user_id)
        }
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
