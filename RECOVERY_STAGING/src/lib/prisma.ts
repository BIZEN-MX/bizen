import { PrismaClient } from '@prisma/client'

export const getPrismaClient = () => {
  const isProd = process.env.NODE_ENV === 'production'
  let databaseUrl = process.env.DATABASE_URL || process.env.BIZEN_DATABASE_URL

  if (databaseUrl) {
    // Remove potential surrounding quotes from cloud secrets
    databaseUrl = databaseUrl.trim().replace(/^["'](.+)["']$/, '$1')

    if (!databaseUrl.includes('connection_limit=')) {
      databaseUrl += (databaseUrl.includes('?') ? '&' : '?') + 'connection_limit=' + (isProd ? '15' : '5')
    }
  }

  try {
    if (!isProd) console.log('🔌 Prisma connecting to:', databaseUrl?.replace(/:[^:]+@/, ':****@'));
    return new PrismaClient({
      datasourceUrl: databaseUrl || undefined,
      log: isProd ? ['error'] : ['error', 'warn'],
    })
  } catch (error) {
    console.error('❌ PRISMA INITIALIZATION ERROR:', error)
    // Return a dummy client proxy to prevent total crash
    return new Proxy({}, {
      get: () => () => { throw new Error('Database connection failed. Please check logs.') }
    }) as any
  }
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof getPrismaClient>;
} & typeof global;

export const prisma = globalThis.prismaGlobal ?? getPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma
}
