import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth/api-auth"
import { ensureProfile } from "@/lib/profiles"

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (!authResult.success || !authResult.data?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { user } = authResult.data

    // Ensure profile exists
    await ensureProfile(user.id, user.email, user.user_metadata?.full_name);

    let profile = await (prisma as any).credit_sim_profiles.findFirst({
      where: { user_id: user.id },
      include: { scenarios: true },
      orderBy: { created_at: "desc" }
    })

    if (!profile) {
      return NextResponse.json({ scenarios: [] })
    }

    return NextResponse.json({ scenarios: profile.scenarios })
  } catch (error) {
    console.error("Error fetching credit profile:", error)
    return NextResponse.json({ error: "Failed to fetch credit profile" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (!authResult.success || !authResult.data?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { user } = authResult.data
    const { scenario_type, inputs_json } = await request.json()

    if (!scenario_type || !inputs_json) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    // Ensure profile exists before creating simulator profile
    await ensureProfile(user.id, user.email, user.user_metadata?.full_name);

    // Get or create profile
    let profile = await (prisma as any).credit_sim_profiles.findFirst({
      where: { user_id: user.id }
    })

    if (!profile) {
      profile = await (prisma as any).credit_sim_profiles.create({
        data: { user_id: user.id }
      })
    }

    // Upsert scenario for this profile
    const existingScenario = await (prisma as any).credit_sim_scenarios.findFirst({
      where: { profile_id: profile.id, scenario_type }
    })

    let scenario;
    if (existingScenario) {
      scenario = await (prisma as any).credit_sim_scenarios.update({
        where: { id: existingScenario.id },
        data: { inputs_json }
      })
    } else {
      scenario = await (prisma as any).credit_sim_scenarios.create({
        data: {
          profile_id: profile.id,
          scenario_type,
          inputs_json
        }
      })
    }

    return NextResponse.json({ success: true, scenario })
  } catch (error) {
    console.error("Error saving credit scenario:", error)
    return NextResponse.json({ error: "Failed to save credit scenario" }, { status: 500 })
  }
}
