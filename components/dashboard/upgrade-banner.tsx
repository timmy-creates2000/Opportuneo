import { Button } from "@/components/ui/button"
import { Crown, Sparkles } from "lucide-react"
import Link from "next/link"

interface UpgradeBannerProps {
  userPlan: string
}

export default function UpgradeBanner({ userPlan }: UpgradeBannerProps) {
  if (userPlan === "premium") return null

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-full">
            <Crown className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Unlock Premium Features</h3>
            <p className="text-blue-100 text-sm">
              Get access to Resume Optimizer, Lead Generator, and advanced export features
            </p>
          </div>
        </div>
        <Button asChild variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
          <Link href="/dashboard/upgrade">
            <Sparkles className="h-4 w-4 mr-2" />
            Upgrade Now
          </Link>
        </Button>
      </div>
    </div>
  )
}
