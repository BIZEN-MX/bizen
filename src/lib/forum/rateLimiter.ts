import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: Date
}

export async function checkRateLimit(
  userId: string,
  actionType: 'create_thread' | 'create_comment' | 'create_vote',
  limit: number = 10,
  windowMinutes: number = 60
): Promise<RateLimitResult> {
  try {
    const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000)

    // Clean up old rate limit records
    await prisma.$executeRaw`
      DELETE FROM forum_rate_limits 
      WHERE window_start < ${windowStart}
    `

    // Count recent actions
    const recentActions = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*) as count
      FROM forum_rate_limits
      WHERE user_id = ${userId}
      AND action_type = ${actionType}
      AND window_start >= ${windowStart}
    `

    const count = Number(recentActions[0]?.count || 0)

    if (count >= limit) {
      const resetAt = new Date(Date.now() + windowMinutes * 60 * 1000)
      return {
        allowed: false,
        remaining: 0,
        resetAt
      }
    }

    // Record this action
    await prisma.$executeRaw`
      INSERT INTO forum_rate_limits (user_id, action_type, window_start)
      VALUES (${userId}, ${actionType}, NOW())
    `

    const resetAt = new Date(Date.now() + windowMinutes * 60 * 1000)
    return {
      allowed: true,
      remaining: limit - count - 1,
      resetAt
    }
  } catch (error) {
    console.error("Rate limit error:", error)
    // Fail open - allow action if error
    return {
      allowed: true,
      remaining: limit,
      resetAt: new Date(Date.now() + windowMinutes * 60 * 1000)
    }
  }
}

export async function getRateLimitInfo(
  userId: string,
  actionType: 'create_thread' | 'create_comment' | 'create_vote'
): Promise<{
  count: number
  limit: number
}> {
  const windowMinutes = 60
  const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000)

  const result = await prisma.$queryRaw<Array<{ count: bigint }>>`
    SELECT COUNT(*) as count
    FROM forum_rate_limits
    WHERE user_id = ${userId}
    AND action_type = ${actionType}
    AND window_start >= ${windowStart}
  `

  const limits: Record<string, number> = {
    'create_thread': 5,
    'create_comment': 20,
    'create_vote': 50
  }

  return {
    count: Number(result[0]?.count || 0),
    limit: limits[actionType]
  }
}

