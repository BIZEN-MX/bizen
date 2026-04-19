import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const gameId = parseInt(params.gameId)

    // Verify game belongs to user
    const { data: gameSession } = await supabase
      .from('game_sessions')
      .select('*')
      .eq('id', gameId)
      .eq('user_id', user.id)
      .single()

    if (!gameSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Delete game (cascade will handle related records)
    const { error: deleteError } = await supabase
      .from('game_sessions')
      .delete()
      .eq('id', gameId)
      .eq('user_id', user.id)

    if (deleteError) throw deleteError

    return NextResponse.json({ message: "Game deleted successfully" })

  } catch (error) {
    console.error("Error deleting game:", error)
    return NextResponse.json({ error: "Failed to delete game" }, { status: 500 })
  }
}
