"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Crown } from "lucide-react"

interface PaystackButtonProps {
  userId: string
  userEmail: string
}

export default function PaystackButton({ userId, userEmail }: PaystackButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handlePaystackPayment = async () => {
    setIsLoading(true)

    try {
      // Initialize Paystack payment
      const response = await fetch("/api/payments/paystack/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          amount: 300000, // ₦3,000 in kobo
          userId: userId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Redirect to Paystack payment page
        window.location.href = data.authorization_url
      } else {
        throw new Error(data.message || "Payment initialization failed")
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
      onClick={handlePaystackPayment}
      disabled={isLoading}
      className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Processing...
        </>
      ) : (
        <>
          <Crown className="h-4 w-4 mr-2" />
          Pay with Paystack (₦3,000/month)
        </>
      )}
    </Button>
  )
}
