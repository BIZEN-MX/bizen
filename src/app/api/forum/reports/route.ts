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
    const { targetType, targetId, reason, details } = body

    if (!targetType || !targetId || !reason) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!['thread', 'comment', 'user'].includes(targetType)) {
      return NextResponse.json({ error: "Invalid target type" }, { status: 400 })
    }

    // Create report
    const report = await prisma.forumReport.create({
      data: {
        reporterId: user.id,
        targetType,
        targetId,
        reason,
        details
      }
    })

    // Check if content has 3+ reports - auto-hide
    const reportCount = await prisma.forumReport.count({
      where: {
        targetType,
        targetId,
        status: { in: ['open', 'reviewing'] }
      }
    })

    if (reportCount >= 3) {
      if (targetType === 'thread') {
        await prisma.forumThread.update({
          where: { id: targetId },
          data: { isHidden: true, moderationStatus: 'pending' }
        })
      } else if (targetType === 'comment') {
        await prisma.forumComment.update({
          where: { id: targetId },
          data: { isHidden: true, moderationStatus: 'pending' }
        })
      }
      console.log(`⚠️ Auto-hidden ${targetType} ${targetId} due to 3+ reports`)
    }

    console.log(`✅ Report created by user ${user.id} for ${targetType} ${targetId}`)

    return NextResponse.json(report, { status: 201 })
  } catch (error) {
    console.error("Error creating report:", error)
    return NextResponse.json({ error: "Failed to create report" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

