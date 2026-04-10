import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  // Setup Prisma with optimized connection pooling
  const isProd = process.env.NODE_ENV === 'production'
  const customUrl = process.env.DATABASE_URL
  
  // In serverless (Vercel), we must be very careful with connection counts.
  // Each lambda can open its own connections. We force a conservative limit.
  // Ensure optimized connection limits and timeouts for all connections
  let finalUrl = customUrl
  if (finalUrl) {
    // Basic pgbouncer safety (even if not using pgbouncer, these parameters help stability)
    if (!finalUrl.includes('connection_limit=')) {
      finalUrl += (finalUrl.includes('?') ? '&' : '?') + 'connection_limit=' + (isProd ? '10' : '5')
    }
    if (!finalUrl.includes('pool_timeout=')) {
      finalUrl += '&pool_timeout=30'
    }
    
    // If using Supabase Pooler (6543)
    if (finalUrl.includes(':6543') && !finalUrl.includes('pgbouncer=')) {
      finalUrl += '&pgbouncer=true'
    }
  }

  if (!isProd) {
    console.log('🔌 Prisma connecting to:', finalUrl?.replace(/:([^:@/]+)@/, ':****@'))
  }

  return new PrismaClient({
    datasourceUrl: finalUrl,
    log: isProd ? ['error'] : ['error', 'warn'], // Remove 'query' to clean up logs
  })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

// In production, Next.js can still hot-reload or have multiple module instances.
// We assign to globalThis even in prod if available, though it's most critical in dev.
if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma
}
