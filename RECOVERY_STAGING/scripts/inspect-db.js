const { PrismaClient } = require('@prisma/client')

const url = 'postgresql://postgres.qkrttsukyuujjovrjhjk:Yeyo.312603.@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require'

async function inspect() {
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: url
            }
        }
    })

    try {
        console.log('📡 Introspecting School table...')
        const columns = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'contact_messages'
    `
        console.log('📊 Columns in "schools":', JSON.stringify(columns, null, 2))

        const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `
        console.log('📋 Existing tables:', JSON.stringify(tables.map(t => t.table_name), null, 2))

    } catch (err) {
        console.error('❌ Inspection failed:', err.message)
    } finally {
        await prisma.$disconnect()
    }
}

inspect()
