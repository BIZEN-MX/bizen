const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL || 'postgresql://postgres.qkrttsukyuujjovrjhjk:Yeyo.312603.@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require'
        }
    }
});

async function main() {
    console.log('🚀 Running SQL migration...');
    const sql = fs.readFileSync(path.join(__dirname, '../db_migrations/06_market_symbols.sql'), 'utf8');
    
    // Split the SQL into statements and execute them individually
    // This isn't perfect but works for simple migrations
    // It's better to use raw query if Prisma supports it for multiple statements
    try {
        await prisma.$executeRawUnsafe(sql);
        console.log('✅ Migration executed successfully');
    } catch (err) {
        console.error('❌ Migration failed:', err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
