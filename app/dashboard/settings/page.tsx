"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { User, Mail, Calendar, Crown } from "lucide-react"

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      setUser(user)
      setEmail(user.email || "")

      // Get user profile
      const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single()

      if (profile) {
        setUserProfile(profile)
        setName(profile.name || "")
      }
    }

    getUser()
  }, [router])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    const supabase = createClient()

    try {
      // Update user profile
      const { error } = await supabase.from("users").update({ name }).eq("id", user.id)

      if (error) throw error

      setMessage("Profile updated successfully!")
      setUserProfile({ ...userProfile, name })
    } catch (error: any) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return
    }

    const supabase = createClient()

    try {
      // Note: In a real app, you'd want to handle this server-side
      // This is a simplified version
      await supabase.auth.signOut()
      router.push("/")
    } catch (error: any) {
      setMessage(`Error: ${error.message}`)
    }
  }

  if (!user || !userProfile) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account information and preferences</p>
      </div>

      {/* Account Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Mail className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Email</p>
                <p className="text-sm text-gray-600">{email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Member Since</p>
                <p className="text-sm text-gray-600">{new Date(userProfile.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <Crown className="h-5 w-5 text-yellow-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">Current Plan</p>
              <p className="text-sm text-gray-600 capitalize">{userProfile.plan} Plan</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={email} disabled className="bg-gray-50" />
              <p className="text-xs text-gray-500">
                Email cannot be changed. Contact support if you need to update your email.
              </p>
            </div>

            {message && (
              <div
                className={`text-sm p-3 rounded-md ${
                  message.includes("Error") ? "text-red-600 bg-red-50" : "text-green-600 bg-green-50"
                }`}
              >
                {message}
              </div>
            )}

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription>Irreversible and destructive actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Delete Account</h4>
              <p className="text-sm text-gray-600">Permanently delete your account and all associated data</p>
            </div>
            <Button variant="destructive" onClick={handleDeleteAccount} className="ml-4">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
