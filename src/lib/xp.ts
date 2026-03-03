// XP and Level Calculation Utilities

/**
 * Calculate the level from total XP
 * Formula: Each level requires more XP than the last
 * Level 1: 0 XP
 * Level 2: 100 XP
 * Level 3: 250 XP (150 more)
 * Level 4: 450 XP (200 more)
 * Each level requires +50 more XP than the previous gap
 */
export function calculateLevel(xp: number): number {
  if (xp < 100) return 1

  let level = 1
  let totalXpNeeded = 0
  let xpForNextLevel = 100

  while (totalXpNeeded + xpForNextLevel <= xp) {
    totalXpNeeded += xpForNextLevel
    level++
    xpForNextLevel += 50 // Each level requires 50 more XP than the previous
  }

  return level
}

/**
 * Calculate total XP needed to reach a specific level
 */
export function xpForLevel(level: number): number {
  if (level <= 1) return 0

  let totalXp = 0
  let xpForNextLevel = 100

  for (let i = 1; i < level; i++) {
    totalXp += xpForNextLevel
    xpForNextLevel += 50
  }

  return totalXp
}

/**
 * Calculate XP needed for the next level
 */
export function xpForNextLevel(currentXp: number): number {
  const currentLevel = calculateLevel(currentXp)
  const nextLevelXp = xpForLevel(currentLevel + 1)
  return nextLevelXp - currentXp
}

/**
 * Calculate current XP progress within the current level
 */
export function xpInCurrentLevel(currentXp: number): number {
  const currentLevel = calculateLevel(currentXp)
  const currentLevelStartXp = xpForLevel(currentLevel)
  return currentXp - currentLevelStartXp
}

/**
 * Calculate total XP needed for the next level
 */
export function totalXpForNextLevel(currentXp: number): number {
  const currentLevel = calculateLevel(currentXp)
  const currentLevelStartXp = xpForLevel(currentLevel)
  const nextLevelStartXp = xpForLevel(currentLevel + 1)
  return nextLevelStartXp - currentLevelStartXp
}

/**
 * Calculate XP progress percentage in current level
 */
export function xpProgressPercentage(currentXp: number): number {
  const xpInLevel = xpInCurrentLevel(currentXp)
  const totalXpNeeded = totalXpForNextLevel(currentXp)
  return Math.round((xpInLevel / totalXpNeeded) * 100)
}

/**
 * XP rewards for different activities
 */
export const XP_REWARDS = {
  LESSON_COMPLETE: 50,
  QUIZ_PASS: 100,
  QUIZ_PERFECT: 150,
  ASSIGNMENT_SUBMIT: 75,
  ASSIGNMENT_PERFECT: 125,
  DAILY_STREAK: 25,
  COURSE_COMPLETE: 500,
}

/**
 * Helper to get the midnight equivalent date object for Mexico City time.
 * Useful for streak calculations so that users in Mexico don't lose their streak 
 * because UTC midnight rolls over at 6:00 PM local time.
 */
export function getMexicoMidnight(date: Date = new Date()): Date {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Mexico_City",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(date);

  const year = parseInt(parts.find(p => p.type === "year")!.value);
  const month = parseInt(parts.find(p => p.type === "month")!.value);
  const day = parseInt(parts.find(p => p.type === "day")!.value);

  // Return start of the day in UTC for consistent subtraction logic
  return new Date(Date.UTC(year, month - 1, day));
}

/**
 * Calculates if a streak is still alive based on Mexico City time.
 */
export function calculateCurrentStreak(lastActive: Date | null | undefined, currentStreak: number): number {
  if (!lastActive) return currentStreak || 0
  if (!currentStreak) return 0

  const todayMx = getMexicoMidnight(new Date())
  const lastActiveMx = getMexicoMidnight(new Date(lastActive))

  const diffDays = Math.floor((todayMx.getTime() - lastActiveMx.getTime()) / 86400000)

  if (diffDays > 1) return 0 // Streak broken
  return currentStreak
}

