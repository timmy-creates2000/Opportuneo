"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { createBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Search,
  Code,
  FileText,
  Users,
  TrendingUp,
  Newspaper,
  Settings,
  LogOut,
  Menu,
  X,
  Crown,
  CreditCard,
} from "lucide-react"

interface SidebarProps {
  userPlan: string
  userName: string
}

export default function Sidebar({ userPlan, userName }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createBrowserClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: TrendingUp, current: pathname === "/dashboard" },
    { name: "Job Search", href: "/dashboard/jobs", icon: Search, current: pathname === "/dashboard/jobs" },
    { name: "Boolean Builder", href: "/dashboard/boolean", icon: Code, current: pathname === "/dashboard/boolean" },
    {
      name: "Resume Optimizer",
      href: "/dashboard/resume",
      icon: FileText,
      current: pathname === "/dashboard/resume",
      premium: true,
    },
    {
      name: "Lead Generator",
      href: "/dashboard/leads",
      icon: Users,
      current: pathname === "/dashboard/leads",
      premium: true,
    },
    { name: "SEO Tools", href: "/dashboard/seo", icon: TrendingUp, current: pathname === "/dashboard/seo" },
    { name: "Country News", href: "/dashboard/news", icon: Newspaper, current: pathname === "/dashboard/news" },
  ]

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="sm" onClick={() => setIsOpen(!isOpen)} className="bg-white shadow-md">
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Opportuneo</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-600">{userName}</span>
                {userPlan === "premium" && <Crown className="h-4 w-4 text-yellow-500" />}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isLocked = item.premium && userPlan !== "premium"
              return (
                <Link
                  key={item.name}
                  href={isLocked ? "#" : item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    item.current
                      ? "bg-blue-50 text-blue-700"
                      : isLocked
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={(e) => {
                    if (isLocked) {
                      e.preventDefault()
                    } else if (isOpen) {
                      setIsOpen(false)
                    }
                  }}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                  {isLocked && <Crown className="h-4 w-4 text-yellow-500 ml-auto" />}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t space-y-2">
            <Link
              href="/dashboard/billing"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/dashboard/billing" ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <CreditCard className="h-5 w-5" />
              <span>Billing</span>
            </Link>
            <Link
              href="/dashboard/settings"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/dashboard/settings" ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setIsOpen(false)} />
      )}
    </>
  )
}
