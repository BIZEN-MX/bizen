const { PrismaClient } = require('@prisma/client')

const urls = [
    'postgresql://postgres.qkrttsukyuujjovrjhjk:diegopenita31@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require',
    'postgresql://postgres.qkrttsukyuujjovrjhjk:Yeyo.312603.@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require',
    'postgresql://postgres.jbodeaqxjaezzjwewvrg:diegopenita31@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require'
]

async function testConnection() {
    for (const url of urls) {
        console.log(`\n📡 Testing URL: ${url.replace(/:([^@]+)@/, ':****@')}`)
        const prisma = new PrismaClient({
            datasources: {
                db: {
                    url: url
                }
            }
        })

        try {
            const result = await prisma.$queryRaw`SELECT 1 as result`
            console.log('✅ Connection successful:', JSON.stringify(result))
            await prisma.$disconnect()
            process.exit(0)
        } catch (err) {
            console.error('❌ Connection failed:', err.message)
            await prisma.$disconnect()
        }
    }
    process.exit(1)
}

testConnection()
