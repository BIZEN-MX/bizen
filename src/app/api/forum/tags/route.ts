import { NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Tags are public - no auth required
    console.log("🔍 Fetching forum tags...")
    
    const tags = await prisma.forumTag.findMany({
      orderBy: { usageCount: 'desc' },
      take: 50
    })

    console.log(`✅ Found ${tags.length} tags`)
    return NextResponse.json(tags)
  } catch (error: any) {
    console.error("❌ Error fetching tags:", error)
    console.error("Error details:", error.message)
    return NextResponse.json({ 
      error: "Failed to fetch tags",
      details: error.message,
      hint: "Tags will be created when you create threads"
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

