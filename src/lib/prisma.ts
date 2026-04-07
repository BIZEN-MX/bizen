import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  // Setup Prisma with optimized connection pooling
  const isProd = process.env.NODE_ENV === 'production'
  const customUrl = process.env.DATABASE_URL
  
  // In serverless (Vercel), we must be very careful with connection counts.
  // Each lambda can open its own connections. We force a conservative limit.
  let finalUrl = customUrl
  if (finalUrl && finalUrl.includes(':6543')) {
    // Supabase Transaction Pooler needs pgbouncer=true
    if (!finalUrl.includes('pgbouncer=')) {
      finalUrl += (finalUrl.includes('?') ? '&' : '?') + 'pgbouncer=true'
    }
    // Set a strict connection limit to prevent "Max client connections reached"
    // 2-3 connections per lambda is usually enough and prevents crashing the pool.
    if (!finalUrl.includes('connection_limit=')) {
      finalUrl += '&connection_limit=' + (isProd ? '3' : '10')
    }
    if (!finalUrl.includes('pool_timeout=')) {
      finalUrl += '&pool_timeout=20'
    }
  }

  return new PrismaClient({
    datasourceUrl: finalUrl,
    log: isProd ? ['error'] : ['query', 'error', 'warn'],
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
