import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth/api-auth"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  try {
    const authResult = await requireAuth(request)
    if (!authResult.success) {
      return authResult.response
    }
    const { user } = authResult.data

    const { gameId } = await params
    const parsedGameId = parseInt(gameId)

    // Verify game belongs to user
    const gameSession = await prisma.gameSession.findUnique({
      where: { id: parsedGameId }
    })

    if (!gameSession || gameSession.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Delete game (cascade will handle related records based on Prisma schema)
    await prisma.gameSession.delete({
      where: { id: parsedGameId }
    })

    return NextResponse.json({ message: "Game deleted successfully" })

  } catch (error) {
    console.error("Error deleting game:", error)
    return NextResponse.json({ error: "Failed to delete game" }, { status: 500 })
  }
}
