import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user profile from our users table
    const { data: profile, error: profileError } = await supabase.from("users").select("*").eq("id", user.id).single()

    if (profileError) {
      // If profile doesn't exist, create it
      if (profileError.code === "PGRST116") {
        const { data: newProfile, error: createError } = await supabase
          .from("users")
          .insert({
            id: user.id,
            name: user.user_metadata?.name || "",
            email: user.email || "",
            plan: "free",
          })
          .select()
          .single()

        if (createError) {
          return NextResponse.json({ error: "Failed to create profile" }, { status: 500 })
        }

        return NextResponse.json({ profile: newProfile })
      }

      return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = createServerClient()
    const { name } = await request.json()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: updatedProfile, error: updateError } = await supabase
      .from("users")
      .update({ name })
      .eq("id", user.id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }

    return NextResponse.json({ profile: updatedProfile })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
