import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { currentUser, clerkClient } from "@clerk/nextjs/server"

const SUPER_ADMINS = ["diego@bizen.mx"]

async function isSuperAdmin() {
  const user = await currentUser()
  const email = user?.emailAddresses[0]?.emailAddress.toLowerCase()
  return email && SUPER_ADMINS.includes(email)
}

export async function POST(request: NextRequest) {
  if (!await isSuperAdmin()) {
    return NextResponse.json({ error: "No tienes permisos de Super Admin" }, { status: 403 })
  }

  try {
    const client = await clerkClient()
    
    // Fetch users from Clerk (limiting to 500 for safety, enough for current BIZEN state)
    const clerkRes = await client.users.getUserList({ limit: 500 })
    const clerkUsers = Array.isArray(clerkRes) ? clerkRes : (clerkRes as any).data || []

    // Fetch all existing userIds from Prisma
    const profiles = await prisma.profile.findMany({
      select: { userId: true }
    })
    const existingUserIds = new Set(profiles.map(p => p.userId))

    let syncedCount = 0

    // Compare and insert missing ones
    for (const clerkUser of clerkUsers) {
      if (!existingUserIds.has(clerkUser.id)) {
        await prisma.profile.create({
          data: {
            userId: clerkUser.id,
            fullName: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Sin nombre',
            role: "student",
            bizcoins: 0,
            xp: 0,
            level: 1
          }
        })
        syncedCount++
      }
    }

    return NextResponse.json({ success: true, syncedCount })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
