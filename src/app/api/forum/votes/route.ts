import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { targetType, targetId, value } = body

    if (!targetType || !targetId || ![1, -1].includes(value)) {
      return NextResponse.json({ error: "Invalid vote data" }, { status: 400 })
    }

    // Check for existing vote
    const existingVote = await prisma.forumVote.findUnique({
      where: {
        userId_targetType_targetId: {
          userId: user.id,
          targetType,
          targetId
        }
      }
    })

    if (existingVote) {
      if (existingVote.value === value) {
        // Same vote - remove it
        await prisma.forumVote.delete({
          where: { id: existingVote.id }
        })

        // Update score
        if (targetType === 'thread') {
          await prisma.forumThread.update({
            where: { id: targetId },
            data: { score: { decrement: value } }
          })
        } else {
          await prisma.forumComment.update({
            where: { id: targetId },
            data: { score: { decrement: value } }
          })
        }

        return NextResponse.json({ voted: false, value: 0 })
      } else {
        // Different vote - update it
        await prisma.forumVote.update({
          where: { id: existingVote.id },
          data: { value }
        })

        // Update score (remove old vote, add new vote)
        const scoreChange = value - existingVote.value
        if (targetType === 'thread') {
          await prisma.forumThread.update({
            where: { id: targetId },
            data: { score: { increment: scoreChange } }
          })
        } else {
          await prisma.forumComment.update({
            where: { id: targetId },
            data: { score: { increment: scoreChange } }
          })
        }

        return NextResponse.json({ voted: true, value })
      }
    } else {
      // New vote - create it
      await prisma.forumVote.create({
        data: {
          userId: user.id,
          targetType,
          targetId,
          value
        }
      })

      // Update score
      if (targetType === 'thread') {
        await prisma.forumThread.update({
          where: { id: targetId },
          data: { score: { increment: value } }
        })
      } else {
        await prisma.forumComment.update({
          where: { id: targetId },
          data: { score: { increment: value } }
        })

        // Award XP to comment author if upvote
        if (value === 1) {
          const comment = await prisma.forumComment.findUnique({
            where: { id: targetId }
          })
          if (comment) {
            await prisma.profile.update({
              where: { userId: comment.authorId },
              data: { reputation: { increment: 2 } }
            })
          }
        }
      }

      return NextResponse.json({ voted: true, value })
    }
  } catch (error) {
    console.error("Error voting:", error)
    return NextResponse.json({ error: "Failed to vote" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

