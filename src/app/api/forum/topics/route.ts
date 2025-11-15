import { NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { PrismaClient } from "@prisma/client"

const prisma = process.env.DATABASE_URL ? new PrismaClient() : null

export async function GET() {
  if (!prisma) {
    console.warn("⚠️ DATABASE_URL not configured. Returning empty forum topics list.")
    return NextResponse.json([])
  }

  try {
    // Topics are public - no auth required
    console.log("🔍 Fetching forum topics...")
    
    const topics = await prisma.forumTopic.findMany({
      orderBy: { orderIndex: 'asc' }
    })

    console.log(`✅ Found ${topics.length} topics`)
    return NextResponse.json(topics)
  } catch (error: any) {
    console.warn("⚠️ Error fetching topics (returning empty list):", error.message || String(error))
    // Return empty array instead of error - topics will be available once database is set up
    return NextResponse.json([])
  } finally {
    if (prisma) {
      await prisma.$disconnect().catch(() => {})
    }
  }
}
