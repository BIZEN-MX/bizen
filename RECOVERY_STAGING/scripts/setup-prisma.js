#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Prisma with Supabase...\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env.local file...');
  
  const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Prisma Database Configuration
# Replace with your Supabase PostgreSQL connection string
# Format: postgresql://postgres:[password]@[host]:[port]/[database]?schema=public
DATABASE_URL="postgresql://postgres:[password]@[host]:[port]/[database]?schema=public"
DIRECT_URL="postgresql://postgres:[password]@[host]:[port]/[database]?schema=public"
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local file');
  console.log('⚠️  Please update the DATABASE_URL and DIRECT_URL with your Supabase PostgreSQL connection string\n');
} else {
  console.log('✅ .env.local already exists');
}

console.log('📋 Next steps:');
console.log('1. Update your .env.local with the correct Supabase PostgreSQL connection string');
console.log('2. Run: npx prisma db push (to sync schema with your database)');
console.log('3. Run: npx prisma generate (to generate the Prisma client)');
console.log('4. Start your development server: npm run dev\n');

console.log('🔗 Supabase Connection String Format:');
console.log('postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1');
console.log('\n📚 For more information, visit: https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooling');
