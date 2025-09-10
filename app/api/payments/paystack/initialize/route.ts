import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { email, amount, userId } = await request.json()

    // Verify user is authenticated
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user || user.id !== userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Initialize Paystack payment
    const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount,
        currency: "NGN",
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/paystack/callback`,
        metadata: {
          userId,
          plan: "premium",
        },
      }),
    })

    const paystackData = await paystackResponse.json()

    if (paystackData.status) {
      return NextResponse.json({
        success: true,
        authorization_url: paystackData.data.authorization_url,
        reference: paystackData.data.reference,
      })
    } else {
      return NextResponse.json(
        { success: false, message: paystackData.message || "Payment initialization failed" },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("Paystack initialization error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
