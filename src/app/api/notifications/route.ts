import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const [forumNotifs, systemNotifs] = await Promise.all([
      prisma.forumNotification.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 25
      }),
      prisma.notification.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 25
      })
    ])

    const [forumUnread, systemUnread] = await Promise.all([
      prisma.forumNotification.count({
        where: { userId: user.id, readAt: null }
      }),
      prisma.notification.count({
        where: { userId: user.id, readAt: null }
      })
    ])

    const notifications = [...forumNotifs, ...systemNotifs].sort((a, b) => 
      (new Date(b.createdAt || 0).getTime()) - (new Date(a.createdAt || 0).getTime())
    )

    return NextResponse.json({ notifications, unreadCount: forumUnread + systemUnread })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
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
      await Promise.all([
        prisma.forumNotification.updateMany({
          where: { userId: user.id, readAt: null },
          data: { readAt: new Date() }
        }),
        prisma.notification.updateMany({
          where: { userId: user.id, readAt: null },
          data: { readAt: new Date() }
        })
      ])
    } else if (notificationId) {
      // Try forum first, then system
      try {
        await prisma.forumNotification.update({
          where: { id: notificationId, userId: user.id },
          data: { readAt: new Date() }
        })
      } catch (e) {
        await prisma.notification.update({
          where: { id: notificationId, userId: user.id },
          data: { readAt: new Date() }
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating notifications:", error)
    return NextResponse.json({ error: "Failed to update notifications" }, { status: 500 })
  }
}

