import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"

const SUPER_ADMINS = ["diego@bizen.mx"]

async function isSuperAdmin() {
  const user = await currentUser()
  const email = user?.emailAddresses[0]?.emailAddress.toLowerCase()
  return email && SUPER_ADMINS.includes(email)
}

// Singleton key for the banner profile
const BANNER_CONFIG_ID = "GLOBAL_CONFIG_BANNER"

export async function GET(request: NextRequest) {
  try {
    const configProfile = await prisma.profile.findUnique({
      where: { userId: BANNER_CONFIG_ID },
      select: { settings: true }
    })
    
    return NextResponse.json({ banner: configProfile?.settings || null })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!await isSuperAdmin()) {
    return NextResponse.json({ error: "No tienes permisos de Super Admin" }, { status: 403 })
  }

  try {
    const body = await request.json()
    // banner object: { isActive: boolean, title: string, text: string, link: string, linkText: string, color: string }

    const configProfile = await prisma.profile.upsert({
      where: { userId: BANNER_CONFIG_ID },
      update: { settings: body },
      create: {
        userId: BANNER_CONFIG_ID,
        fullName: "System Configuration",
        role: "system",
        settings: body
      }
    })

    return NextResponse.json({ success: true, banner: configProfile.settings })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
