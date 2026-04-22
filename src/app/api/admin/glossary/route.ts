import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"

const SUPER_ADMINS = ["diego@bizen.mx"]

async function isSuperAdmin() {
  const user = await currentUser()
  const email = user?.emailAddresses[0]?.emailAddress.toLowerCase()
  return email && SUPER_ADMINS.includes(email)
}

const GLOSSARY_CONFIG_ID = "GLOBAL_CONFIG_GLOSSARY"

export async function GET(request: NextRequest) {
  try {
    const configProfile = await prisma.profile.findUnique({
      where: { userId: GLOSSARY_CONFIG_ID },
      select: { settings: true }
    })
    
    // config.settings will be an array of terms { word: string, definition: string }
    const terms = (configProfile?.settings as any)?.terms || []
    return NextResponse.json({ terms })
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
    const { terms } = body

    if (!Array.isArray(terms)) {
      return NextResponse.json({ error: "Formato inválido" }, { status: 400 })
    }

    const configProfile = await prisma.profile.upsert({
      where: { userId: GLOSSARY_CONFIG_ID },
      update: { settings: { terms } },
      create: {
        userId: GLOSSARY_CONFIG_ID,
        fullName: "System Glossary Config",
        role: "system",
        settings: { terms }
      }
    })

    return NextResponse.json({ success: true, terms: (configProfile.settings as any).terms })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
