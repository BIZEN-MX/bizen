import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  request: NextRequest,
  { params }: { params: { gameId: string } }
) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const gameId = parseInt(params.gameId)

    // Verify game belongs to user
    const gameSession = await prisma.gameSession.findUnique({
      where: { id: gameId }
    })

    if (!gameSession) {
      return NextResponse.json(
        { error: "Game not found" },
        { status: 404 }
      )
    }

    if (gameSession.userId !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    // Delete game (cascade will delete all related data)
    await prisma.gameSession.delete({
      where: { id: gameId }
    })

    return NextResponse.json({
      message: "Game deleted successfully"
    })

  } catch (error) {
    console.error("Error deleting game:", error)
    return NextResponse.json(
      { error: "Failed to delete game" },
      { status: 500 }
    )
  }
}

