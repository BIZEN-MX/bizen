import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  let customUrl = process.env.DATABASE_URL

  // Adjust connections to avoid exhausting the Supabase pooler on hot-reloads while still allowing concurrent requests
  if (customUrl) {
    if (customUrl.includes(':6543') && !customUrl.includes('pgbouncer=')) {
      customUrl += (customUrl.includes('?') ? '&' : '?') + 'pgbouncer=true&pool_timeout=20'
    }
    if (process.env.NODE_ENV === 'development') {
      if (customUrl.includes('connection_limit=')) {
        customUrl = customUrl.replace(/connection_limit=\d+/, 'connection_limit=5')
      } else {
        customUrl += (customUrl.includes('?') ? '&' : '?') + 'connection_limit=5'
      }
    }
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasourceUrl: customUrl || process.env.DATABASE_URL,
  })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
