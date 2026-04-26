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
    
    const settings = (configProfile?.settings as any) || {}
    return NextResponse.json({ 
      maintenanceMode: settings.maintenanceMode === true,
      maintenanceMessage: settings.maintenanceMessage || "Billy está realizando algunos ajustes técnicos para mejorar tu experiencia de aprendizaje. Volveremos muy pronto."
    })
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
    const { maintenanceMode, maintenanceMessage } = body

    const configProfile = await prisma.profile.upsert({
      where: { userId: SYSTEM_CONFIG_ID },
      update: { 
        settings: { 
          maintenanceMode,
          maintenanceMessage 
        } 
      },
      create: {
        userId: SYSTEM_CONFIG_ID,
        fullName: "System General Config",
        role: "system",
        settings: { 
          maintenanceMode,
          maintenanceMessage
        }
      }
    })

    const settings = configProfile.settings as any
    return NextResponse.json({ 
      success: true, 
      maintenanceMode: settings.maintenanceMode,
      maintenanceMessage: settings.maintenanceMessage
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
