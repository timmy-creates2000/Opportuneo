"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Crown } from "lucide-react"

interface StripeButtonProps {
  userId: string
  userEmail: string
}

export default function StripeButton({ userId, userEmail }: StripeButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleStripePayment = async () => {
    setIsLoading(true)

    try {
      // Initialize Stripe checkout
      const response = await fetch("/api/payments/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          userId: userId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Redirect to Stripe checkout
        window.location.href = data.url
      } else {
        throw new Error(data.message || "Checkout creation failed")
      }
    } catch (error) {
      console.error("Payment error:", error)
      alert("Payment initialization failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleStripePayment}
      disabled={isLoading}
      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Processing...
        </>
      ) : (
        <>
          <Crown className="h-4 w-4 mr-2" />
          Pay with Stripe ($2/month)
        </>
      )}
    </Button>
  )
}
