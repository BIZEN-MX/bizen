import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"

const SUPER_ADMINS = ["diego@bizen.mx"]

async function isSuperAdmin() {
  const user = await currentUser()
  const email = user?.emailAddresses[0]?.emailAddress.toLowerCase()
  return email && SUPER_ADMINS.includes(email)
}

const MARKET_CONFIG_ID = "GLOBAL_CONFIG_MARKET"

export const defaultMarketConfig = {
  welcomeBonus: 1000,
  commissionMarket: 0.15, // Porcentaje (0.15 = 0.0015 en el multiplicador)
  commissionLimit: 0.10,  // Porcentaje
  allowCrypto: false,
}

export async function GET(request: NextRequest) {
  try {
    const configProfile = await prisma.profile.findUnique({
      where: { userId: MARKET_CONFIG_ID },
      select: { settings: true }
    })
    
    // Si no existe, devolvemos un defaultValue
    const config = configProfile?.settings || defaultMarketConfig
    return NextResponse.json({ config })
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
    // Asegurarnos de que los valores sean limpios
    const config = {
      welcomeBonus: Number(body.welcomeBonus) || 1000,
      commissionMarket: Number(body.commissionMarket) || 0,
      commissionLimit: Number(body.commissionLimit) || 0,
      allowCrypto: Boolean(body.allowCrypto)
    }

    const configProfile = await prisma.profile.upsert({
      where: { userId: MARKET_CONFIG_ID },
      update: { settings: config },
      create: {
        userId: MARKET_CONFIG_ID,
        fullName: "System Market Config",
        role: "system",
        settings: config
      }
    })

    return NextResponse.json({ success: true, config: configProfile.settings })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
