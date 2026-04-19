const { PrismaClient } = require('@prisma/client')

const url = 'postgresql://postgres.jbodeaqxjaezzjwewvrg:diegopenita31@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require'

async function test() {
    console.log('Testing connection to jbodeaqxjaezzjwewvrg...')
    const prisma = new PrismaClient({
        datasources: { db: { url: url } }
    })

    try {
        await prisma.$connect()
        console.log('✅ Connected successfully!')
        const result = await prisma.$queryRaw`SELECT 1 as result`
        console.log('Result:', result)
    } catch (err) {
        console.error('❌ Connection failed:', err.message)
    } finally {
        await prisma.$disconnect()
    }
}

test()
