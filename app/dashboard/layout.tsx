import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Sidebar from "@/components/dashboard/sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile data
  const { data: userProfile } = await supabase.from("users").select("*").eq("id", data.user.id).single()

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userPlan={userProfile?.plan || "free"} userName={userProfile?.name || "User"} />
      <div className="lg:pl-64">
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
