import { NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export async function GET() {

  try {
    const topics = await prisma.forumTopic.findMany({
      orderBy: { orderIndex: 'asc' }
    })
    return NextResponse.json(topics)
  } catch (error: any) {
    console.error("❌ Error fetching topics:", error)
    return NextResponse.json([])
  }
}
