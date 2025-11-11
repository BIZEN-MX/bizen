import { NextRequest, NextResponse } from "next/server"
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

    const notifications = await prisma.forumNotification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    const unreadCount = await prisma.forumNotification.count({
      where: {
        userId: user.id,
        readAt: null
      }
    })

    return NextResponse.json({ notifications, unreadCount })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { notificationId, markAllRead } = body

    if (markAllRead) {
      // Mark all as read
      await prisma.forumNotification.updateMany({
        where: {
          userId: user.id,
          readAt: null
        },
        data: {
          readAt: new Date()
        }
      })
    } else if (notificationId) {
      // Mark single notification as read
      await prisma.forumNotification.update({
        where: {
          id: notificationId,
          userId: user.id
        },
        data: {
          readAt: new Date()
        }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating notifications:", error)
    return NextResponse.json({ error: "Failed to update notifications" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

