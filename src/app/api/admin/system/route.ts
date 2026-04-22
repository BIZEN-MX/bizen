import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"

const SUPER_ADMINS = ["diego@bizen.mx"]

async function isSuperAdmin() {
  const user = await currentUser()
  const email = user?.emailAddresses[0]?.emailAddress.toLowerCase()
  return email && SUPER_ADMINS.includes(email)
}

const SYSTEM_CONFIG_ID = "GLOBAL_CONFIG_SYSTEM"

export async function GET(request: NextRequest) {
  try {
    const configProfile = await prisma.profile.findUnique({
      where: { userId: SYSTEM_CONFIG_ID },
      select: { settings: true }
    })
    
    // config.settings will contain boolean maintenanceMode
    const maintenanceMode = (configProfile?.settings as any)?.maintenanceMode === true
    return NextResponse.json({ maintenanceMode })
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
    const { maintenanceMode } = body

    const configProfile = await prisma.profile.upsert({
      where: { userId: SYSTEM_CONFIG_ID },
      update: { settings: { maintenanceMode } },
      create: {
        userId: SYSTEM_CONFIG_ID,
        fullName: "System General Config",
        role: "system",
        settings: { maintenanceMode }
      }
    })

    return NextResponse.json({ success: true, maintenanceMode: (configProfile.settings as any).maintenanceMode })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
