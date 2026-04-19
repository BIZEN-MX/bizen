import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Test if professions table exists and has data
    const professionCount = await prisma.profession.count()
    const professions = await prisma.profession.findMany({ take: 3 })
    
    // Test if opportunity_cards has data
    const cardCount = await prisma.opportunityCard.count()
    
    // Test if doodads has data
    const doodadCount = await prisma.doodad.count()

    return NextResponse.json({
      status: "ok",
      professions: {
        count: professionCount,
        sample: professions
      },
      opportunityCards: {
        count: cardCount
      },
      doodads: {
        count: doodadCount
      }
    })
  } catch (error: any) {
    console.error("Database test error:", error)
    return NextResponse.json(
      { 
        status: "error",
        message: error.message,
        code: error.code
      },
      { status: 500 }
    )
  }
}

