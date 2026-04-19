import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// This endpoint can be called periodically (e.g., via cron) to check for users who turned 18
// The database trigger should handle this automatically, but this provides a manual check
export async function POST(request: Request) {
  try {
    // This should be protected with an API key or admin authentication
    const authHeader = request.headers.get("authorization")
    const apiKey = process.env.INTERNAL_API_KEY
    
    if (apiKey && authHeader !== `Bearer ${apiKey}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Find all users who are marked as minors
    const minorUsers = await prisma.profile.findMany({
      where: {
        isMinor: true,
        birthDate: { not: null }
      },
      select: {
        userId: true,
        birthDate: true,
        isMinor: true
      }
    })

    let graduated = 0

    for (const user of minorUsers) {
      if (!user.birthDate) continue

      const birth = new Date(user.birthDate)
      const age = new Date().getFullYear() - birth.getFullYear()
      const monthDiff = new Date().getMonth() - birth.getMonth()
      const dayDiff = new Date().getDate() - birth.getDate()
      const actualAge = (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) ? age - 1 : age

      // If user is now 18 or older, update their status
      if (actualAge >= 18) {
        await prisma.profile.update({
          where: { userId: user.userId },
          data: {
            isMinor: false,
            parentalOverride: false // No longer needed
          }
        })
        graduated++
        console.log(`✅ User ${user.userId} graduated to adult status (turned 18)`)
      }
    }

    return NextResponse.json({
      success: true,
      checked: minorUsers.length,
      graduated,
      message: `Checked ${minorUsers.length} minor users, ${graduated} graduated to adult status`
    })
  } catch (error) {
    console.error("Error checking age graduation:", error)
    return NextResponse.json({ error: "Failed to check age graduation" }, { status: 500 })
  }
}

// GET endpoint for manual trigger (for testing)
export async function GET() {
  return NextResponse.json({
    message: "Use POST to check for age graduation",
    note: "This endpoint should be called periodically (e.g., daily) to check for users who turned 18"
  })
}

