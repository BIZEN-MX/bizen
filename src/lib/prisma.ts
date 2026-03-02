import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * Prisma Client Singleton
 * Prevents multiple instances in development and production.
 *
 * If you see "Error in PostgreSQL connection: Error { kind: Closed }" with Supabase
 * pooler (port 6543), add to your DATABASE_URL: &connection_limit=1
 * Example: ...?pgbouncer=true&sslmode=require&connection_limit=1
 */
// Dynamically fix the DATABASE_URL for Vercel + Supabase Pooler issues
let customUrl = process.env.DATABASE_URL
if (customUrl && customUrl.includes('pooler.supabase.com')) {
  // Switch from direct port 5432 to pooler port 6543
  customUrl = customUrl.replace(':5432', ':6543')

  // Ensure pgbouncer=true and connection_limit=1 are present
  if (!customUrl.includes('pgbouncer=true')) {
    customUrl += (customUrl.includes('?') ? '&' : '?') + 'pgbouncer=true'
  }
  if (!customUrl.includes('connection_limit=')) {
    customUrl += (customUrl.includes('?') ? '&' : '?') + 'connection_limit=1'
  }
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  datasourceUrl: customUrl,
})

// Prevent multiple instances in all environments
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Ensure proper cleanup on process termination
if (typeof process !== 'undefined') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect()
  })
}
