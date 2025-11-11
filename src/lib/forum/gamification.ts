import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function awardXP(
  userId: string,
  amount: number,
  reason: string
): Promise<void> {
  try {
    const profile = await prisma.profile.update({
      where: { userId },
      data: {
        reputation: { increment: amount }
      }
    })

    console.log(`✅ Awarded ${amount} XP to ${userId} for: ${reason}`)

    // Check for new badges
    await checkAndAwardBadges(userId, profile)
  } catch (error) {
    console.error("Error awarding XP:", error)
  }
}

async function checkAndAwardBadges(
  userId: string,
  profile: any
): Promise<void> {
  try {
    const badges = await prisma.forumBadge.findMany()

    for (const badge of badges) {
      let qualifies = false

      if (badge.requirementType === 'reputation') {
        qualifies = profile.reputation >= badge.requirementValue
      } else if (badge.requirementType === 'accepted_answers') {
        qualifies = profile.acceptedAnswers >= badge.requirementValue
      } else if (badge.requirementType === 'posts_created') {
        qualifies = profile.postsCreated >= badge.requirementValue
      }

      if (qualifies) {
        // Try to award badge (ignore if already has it)
        try {
          await prisma.forumUserBadge.create({
            data: {
              userId,
              badgeId: badge.id
            }
          })
          console.log(`🏆 Awarded badge "${badge.name}" to ${userId}`)
        } catch (error) {
          // Badge already exists, ignore
        }
      }
    }
  } catch (error) {
    console.error("Error checking badges:", error)
  }
}

export async function calculateWeeklyScore(userId: string): Promise<number> {
  try {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)

    // Count threads created this week
    const threadsCount = await prisma.forumThread.count({
      where: {
        authorId: userId,
        createdAt: { gte: weekAgo }
      }
    })

    // Count comments created this week
    const commentsCount = await prisma.forumComment.count({
      where: {
        authorId: userId,
        createdAt: { gte: weekAgo }
      }
    })

    // Count accepted answers this week
    const acceptedCount = await prisma.forumComment.count({
      where: {
        authorId: userId,
        isAccepted: true,
        updatedAt: { gte: weekAgo }
      }
    })

    // Calculate score
    const score = (threadsCount * 1) + (commentsCount * 1) + (acceptedCount * 10)

    return score
  } catch (error) {
    console.error("Error calculating weekly score:", error)
    return 0
  }
}

