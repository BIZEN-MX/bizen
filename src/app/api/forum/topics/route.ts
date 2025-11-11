import { NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Topics are public - no auth required
    console.log("🔍 Fetching forum topics...")
    
    const topics = await prisma.forumTopic.findMany({
      orderBy: { orderIndex: 'asc' }
    })

    console.log(`✅ Found ${topics.length} topics`)
    return NextResponse.json(topics)
  } catch (error: any) {
    console.error("❌ Error fetching topics:", error)
    console.error("Error details:", error.message, error.code)
    return NextResponse.json({ 
      error: "Failed to fetch topics",
      details: error.message,
      hint: "Make sure database tables are created"
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
