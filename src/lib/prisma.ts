import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  const isProd = process.env.NODE_ENV === 'production'
  
  // Try both possible env var names
  let databaseUrl = process.env.DATABASE_URL || process.env.BIZEN_DATABASE_URL
  
  if (!databaseUrl) {
    console.error('❌ FATAL: DATABASE_URL is not defined in the environment')
  } else {
    // Optimization: Ensure connection pooling limits
    if (!databaseUrl.includes('connection_limit=')) {
      databaseUrl += (databaseUrl.includes('?') ? '&' : '?') + 'connection_limit=' + (isProd ? '15' : '5')
    }
  }

  const client = new PrismaClient({
    datasourceUrl: databaseUrl,
    log: isProd ? ['error'] : ['error', 'warn'],
  })

  return client
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma
}
