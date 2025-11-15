import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = process.env.DATABASE_URL ? new PrismaClient() : null

export async function GET() {
  if (!prisma) {
    console.warn("⚠️ DATABASE_URL not configured. Returning empty forum tags list.")
    return NextResponse.json([])
  }

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
    console.warn("⚠️ Error fetching tags (returning empty list):", error.message || String(error))
    // Return empty array instead of error - tags will be created when threads are created
    return NextResponse.json([])
  } finally {
    if (prisma) {
      await prisma.$disconnect().catch(() => {})
    }
  }
}

