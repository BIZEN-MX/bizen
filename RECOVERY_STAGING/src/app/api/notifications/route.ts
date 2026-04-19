import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

import { requireAuth } from "@/lib/auth/api-auth"

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)

    if (!authResult.success) {
      console.warn("[API Notifications] Auth failed:", authResult.response.status)
      return authResult.response
    }

    const { user } = authResult.data

    const [forumNotifs, systemNotifs, forumCount, systemCount] = await Promise.all([
      prisma.forumNotification.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 15
      }).catch(e => { console.error("ForumNotif Fetch Error:", e.message); return []; }),
      prisma.notification.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 15
      }).catch(e => { console.error("SystemNotif Fetch Error:", e.message); return []; }),
      prisma.forumNotification.count({
        where: { userId: user.id, readAt: null }
      }).catch(e => { console.error("ForumCount Error:", e.message); return 0; }),
      prisma.notification.count({
        where: { userId: user.id, readAt: null }
      }).catch(e => { console.error("SystemCount Error:", e.message); return 0; })
    ])

    const notifications = [...forumNotifs, ...systemNotifs].sort((a: any, b: any) => 
      (new Date(b.createdAt || 0).getTime()) - (new Date(a.createdAt || 0).getTime())
    )

    return NextResponse.json({
      notifications: notifications.slice(0, 20),
      unreadCount: forumCount + systemCount
    })
  } catch (error: any) {
    console.error("[CRITICAL API ERROR] Error fetching notifications:", error.message, error.stack)
    
    // Safety Fallback for local development
    const host = request.headers.get("host") || "";
    if (host.includes("localhost") || host.includes("127.0.0.1")) {
      console.log("[notifications] Localhost detected during crash. Serving empty results to prevent UI break.")
      return NextResponse.json({
        notifications: [],
        unreadCount: 0,
        warning: "Emergency dev mode"
      })
    }

    return NextResponse.json({ 
        error: "Internal Server Error", 
        message: error.message || "Failed to fetch notifications",
        hint: "Check DB connection pool or authentication state"
    }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    
    if (!authResult.success) {
      return authResult.response
    }

    const { user } = authResult.data

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

