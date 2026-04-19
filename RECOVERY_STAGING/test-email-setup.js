#!/usr/bin/env node

/**
 * Quick diagnostic script to test Supabase email configuration
 * Run with: node test-email-setup.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

console.log('\n🔍 Testing Supabase Email Configuration...\n');

// Read .env.local file
const envPath = path.join(__dirname, '.env.local');
let envVars = {};

try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
  console.log('✓ Found .env.local file');
} catch (err) {
  console.error('❌ Error reading .env.local:', err.message);
  console.log('\nMake sure .env.local exists in the project root.\n');
  process.exit(1);
}

const SUPABASE_URL = envVars.NEXT_PUBLIC_SUPABASE_URL || 'https://jbodeaqxjaezzjwewvrg.supabase.co';
const SUPABASE_ANON_KEY = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE_ROLE_KEY = envVars.SUPABASE_SERVICE_ROLE_KEY;

console.log('✓ Supabase URL:', SUPABASE_URL);
console.log('✓ Anon Key:', SUPABASE_ANON_KEY ? '✅ Found' : '❌ Missing');
console.log('✓ Service Role Key:', SERVICE_ROLE_KEY && SERVICE_ROLE_KEY !== 'YOUR_SERVICE_ROLE_KEY_HERE' ? '✅ Found' : '❌ Not configured');

if (!SUPABASE_ANON_KEY) {
  console.error('\n❌ ERROR: NEXT_PUBLIC_SUPABASE_ANON_KEY not found in .env.local!');
  console.log('Make sure .env.local contains the correct keys.\n');
  process.exit(1);
}

// Test Supabase connection
const projectId = 'jbodeaqxjaezzjwewvrg';
const authUrl = `https://${projectId}.supabase.co/auth/v1/health`;

console.log('\n📡 Testing Supabase connection...');

const options = {
  headers: {
    'apikey': SUPABASE_ANON_KEY
  }
};

https.get(authUrl, options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('✅ Supabase is reachable and API key is valid!\n');
      
      console.log('📋 Configuration Status:\n');
      
      if (!SERVICE_ROLE_KEY || SERVICE_ROLE_KEY === 'YOUR_SERVICE_ROLE_KEY_HERE') {
        console.log('⚠️  WARNING: Service Role Key is not configured!');
        console.log('   The dev confirmation button won\'t work without it.\n');
        console.log('   Get it from:');
        console.log('   https://supabase.com/dashboard/project/jbodeaqxjaezzjwewvrg/settings/api\n');
      } else {
        console.log('✅ All environment variables are configured!\n');
      }
      
      console.log('📋 Next Steps:\n');
      
      console.log('1. ✅ Check Email Confirmation is ENABLED:');
      console.log('   https://supabase.com/dashboard/project/jbodeaqxjaezzjwewvrg/auth/providers');
      console.log('   → Click on "Email" provider');
      console.log('   → Make sure "Confirm email" is toggled ON\n');
      
      console.log('2. 📧 Check Email Templates:');
      console.log('   https://supabase.com/dashboard/project/jbodeaqxjaezzjwewvrg/auth/templates');
      console.log('   → Verify "Confirm signup" template exists\n');
      
      console.log('3. 📊 Monitor Auth Logs (check for errors):');
      console.log('   https://supabase.com/dashboard/project/jbodeaqxjaezzjwewvrg/logs/auth-logs\n');
      
      console.log('4. 🚀 Restart your dev server:');
      console.log('   npm run dev\n');
      
      console.log('5. 🧪 Test signup at:');
      console.log('   http://localhost:3000/signup\n');
      
      console.log('💡 Common Issues:\n');
      console.log('   • Emails going to spam (check spam folder)');
      console.log('   • Rate limits (max 3 emails/hour per address on free tier)');
      console.log('   • Email confirmation disabled in Supabase settings');
      console.log('   • No custom SMTP configured (Supabase default is unreliable)\n');
      
      console.log('🔧 Quick Fix for Development:');
      console.log('   Use the green "DEV: Confirmar cuenta" button on the signup page');
      console.log('   (requires Service Role Key to be configured)\n');
      
    } else {
      console.error('❌ Supabase returned status:', res.statusCode);
      console.error('Response:', data);
    }
  });
}).on('error', (err) => {
  console.error('❌ Connection error:', err.message);
  console.log('\nCheck your internet connection and try again.\n');
});
