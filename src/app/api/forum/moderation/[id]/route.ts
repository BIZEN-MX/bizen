import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id }
    })

    if (!['moderator', 'teacher', 'school_admin'].includes(profile?.role || '')) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { action } = body

    const report = await prisma.forumReport.findUnique({
      where: { id: params.id }
    })

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 })
    }

    let actionTaken = ''

    if (action === 'approve') {
      // Approve content - update moderation status
      if (report.targetType === 'thread') {
        await prisma.forumThread.update({
          where: { id: report.targetId },
          data: { moderationStatus: 'approved', isHidden: false }
        })
      } else if (report.targetType === 'comment') {
        await prisma.forumComment.update({
          where: { id: report.targetId },
          data: { moderationStatus: 'approved', isHidden: false }
        })
      }
      actionTaken = 'Contenido aprobado'
    } else if (action === 'hide') {
      // Hide content
      if (report.targetType === 'thread') {
        await prisma.forumThread.update({
          where: { id: report.targetId },
          data: { isHidden: true }
        })
      } else if (report.targetType === 'comment') {
        await prisma.forumComment.update({
          where: { id: report.targetId },
          data: { isHidden: true }
        })
      }
      actionTaken = 'Contenido ocultado'
    } else if (action === 'delete') {
      // Delete content
      if (report.targetType === 'thread') {
        await prisma.forumThread.delete({
          where: { id: report.targetId }
        })
      } else if (report.targetType === 'comment') {
        await prisma.forumComment.delete({
          where: { id: report.targetId }
        })
      }
      actionTaken = 'Contenido eliminado'
    } else if (action === 'close') {
      actionTaken = 'Reporte cerrado sin acción'
    }

    // Update report
    await prisma.forumReport.update({
      where: { id: params.id },
      data: {
        status: 'closed',
        reviewedBy: user.id,
        reviewedAt: new Date(),
        actionTaken
      }
    })

    return NextResponse.json({ success: true, action: actionTaken })
  } catch (error) {
    console.error("Error taking moderation action:", error)
    return NextResponse.json({ error: "Failed to take action" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

