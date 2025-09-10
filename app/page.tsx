import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Opportuneo</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Your AI-powered job search and career assistant. Find remote, local, and international opportunities with
            intelligent search tools, resume optimization, and recruiter leads.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/auth/signup">Get Started Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Smart Job Search</h3>
              <p className="text-gray-600">
                Find remote, local, full-time, part-time, and internship opportunities with AI-powered search.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Boolean Query Builder</h3>
              <p className="text-gray-600">
                Automatically generate Boolean search queries for accurate Google and LinkedIn job searches.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Resume Optimization</h3>
              <p className="text-gray-600">
                Get AI-powered resume scoring and optimization for better ATS compatibility.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
