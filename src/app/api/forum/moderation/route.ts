import { NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is moderator/admin
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id }
    })

    if (!['moderator', 'teacher', 'school_admin'].includes(profile?.role || '')) {
      return NextResponse.json({ error: "Forbidden - Moderator access required" }, { status: 403 })
    }

    // Get all reports
    const reports = await prisma.forumReport.findMany({
      orderBy: [
        { status: 'asc' },
        { createdAt: 'desc' }
      ],
      include: {
        reporter: {
          select: {
            nickname: true,
            fullName: true
          }
        },
        thread: {
          select: {
            title: true
          }
        },
        comment: {
          select: {
            body: true
          }
        }
      },
      take: 100
    })

    const formatted = reports.map(r => ({
      ...r,
      reporter: {
        nickname: r.reporter.nickname || r.reporter.fullName.split(' ')[0]
      }
    }))

    return NextResponse.json({ reports: formatted })
  } catch (error) {
    console.error("Error fetching moderation queue:", error)
    return NextResponse.json({ error: "Failed to fetch moderation queue" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

