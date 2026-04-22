import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"

const SUPER_ADMINS = ["diego@bizen.mx"]

async function isSuperAdmin(): Promise<boolean> {
  try {
    const user = await currentUser()
    const email = user?.emailAddresses[0]?.emailAddress?.toLowerCase()
    return !!(email && SUPER_ADMINS.includes(email))
  } catch {
    return false
  }
}

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

export async function GET(request: NextRequest) {
  if (!(await isSuperAdmin())) return unauthorized()

  try {
    const missions = await prisma.dailyMission.findMany({
      orderBy: { createdAt: "desc" }
    })
    return NextResponse.json({ missions })
  } catch (error: any) {
    return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!(await isSuperAdmin())) return unauthorized()

  try {
    const body = await request.json()
    const { title, description, objectiveType, targetValue, rewardCoins, icon, isActive } = body
    
    const mission = await prisma.dailyMission.create({
      data: {
        title,
        description,
        objectiveType,
        targetValue: parseInt(targetValue) || 1,
        rewardCoins: parseInt(rewardCoins) || 10,
        icon: icon || "Zap",
        isActive: isActive ?? true
      }
    })
    return NextResponse.json({ mission }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  if (!(await isSuperAdmin())) return unauthorized()

  try {
    const body = await request.json()
    const { id, title, description, objectiveType, targetValue, rewardCoins, icon, isActive } = body
    
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 })

    const mission = await prisma.dailyMission.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(objectiveType !== undefined && { objectiveType }),
        ...(targetValue !== undefined && { targetValue: parseInt(targetValue) }),
        ...(rewardCoins !== undefined && { rewardCoins: parseInt(rewardCoins) }),
        ...(icon !== undefined && { icon }),
        ...(isActive !== undefined && { isActive })
      }
    })
    return NextResponse.json({ mission })
  } catch (error: any) {
    return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await isSuperAdmin())) return unauthorized()

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 })

    await prisma.dailyMission.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 })
  }
}
