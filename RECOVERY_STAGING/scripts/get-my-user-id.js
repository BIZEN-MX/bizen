// Quick script to get your user ID from Supabase
// Usage: node scripts/get-my-user-id.js <your-email>

const { createClient } = require('@supabase/supabase-js');

async function getUserId() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase environment variables');
    console.log('Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set');
    process.exit(1);
  }
  
  const email = process.argv[2];
  
  if (!email) {
    console.log('Usage: node scripts/get-my-user-id.js <your-email>');
    process.exit(1);
  }
  
  console.log(`\n🔍 Looking up user with email: ${email}\n`);
  
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  
  try {
    // Try to find user in profiles table (if you have one)
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // List all users from auth (requires service role key, so this might not work)
    // Instead, we can check if the user is logged in
    
    console.log('Note: You need to be logged in to get your user ID.');
    console.log('\nAlternative: Check your browser console:');
    console.log('1. Go to your app at http://localhost:3000');
    console.log('2. Open Developer Tools (F12)');
    console.log('3. Go to Console tab');
    console.log('4. Type: localStorage.getItem("supabase.auth.token")');
    console.log('5. Or go to Application > Local Storage > supabase.auth.token');
    console.log('\nOr check the database directly:');
    console.log('- Go to Supabase Dashboard > Authentication > Users');
    console.log('- Find your user and copy the UUID\n');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getUserId();

