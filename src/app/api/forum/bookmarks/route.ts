import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { threadId } = body

    if (!threadId) {
      return NextResponse.json({ error: "Thread ID required" }, { status: 400 })
    }

    await prisma.forumBookmark.create({
      data: {
        userId: user.id,
        threadId
      }
    })

    return NextResponse.json({ bookmarked: true })
  } catch (error) {
    console.error("Error bookmarking:", error)
    return NextResponse.json({ error: "Failed to bookmark" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { threadId } = body

    if (!threadId) {
      return NextResponse.json({ error: "Thread ID required" }, { status: 400 })
    }

    await prisma.forumBookmark.delete({
      where: {
        userId_threadId: {
          userId: user.id,
          threadId
        }
      }
    })

    return NextResponse.json({ bookmarked: false })
  } catch (error) {
    console.error("Error removing bookmark:", error)
    return NextResponse.json({ error: "Failed to remove bookmark" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

