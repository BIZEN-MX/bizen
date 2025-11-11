import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const professions = await prisma.profession.findMany({
      orderBy: {
        salary: 'asc'
      }
    })

    return NextResponse.json(professions)
  } catch (error) {
    console.error("Error fetching professions:", error)
    return NextResponse.json(
      { error: "Failed to fetch professions" },
      { status: 500 }
    )
  }
}

