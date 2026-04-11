import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  const isProd = process.env.NODE_ENV === 'production'
  
  let databaseUrl = process.env.DATABASE_URL || process.env.BIZEN_DATABASE_URL
  
  if (!databaseUrl) {
    console.warn('⚠️ WARNING: DATABASE_URL is not defined in the environment. Prisma may fail.')
  } else {
    // Ensure connection pooling limits
    if (databaseUrl && !databaseUrl.includes('connection_limit=')) {
      databaseUrl += (databaseUrl.includes('?') ? '&' : '?') + 'connection_limit=' + (isProd ? '15' : '5')
    }
  }

  return new PrismaClient({
    datasourceUrl: databaseUrl || undefined,
    log: ['error'], 
  })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma
}
