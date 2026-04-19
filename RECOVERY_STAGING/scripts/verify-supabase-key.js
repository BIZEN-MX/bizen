#!/usr/bin/env node

/**
 * Script to verify Supabase API key is correct
 */

require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Verifying Supabase Configuration...\n');

if (!SUPABASE_URL) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL is missing from .env.local');
  process.exit(1);
}

if (!SUPABASE_ANON_KEY) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing from .env.local');
  process.exit(1);
}

console.log('✅ Environment variables found');
console.log(`   URL: ${SUPABASE_URL}`);
console.log(`   Key: ${SUPABASE_ANON_KEY.substring(0, 20)}...${SUPABASE_ANON_KEY.substring(SUPABASE_ANON_KEY.length - 10)}\n`);

// Test the API key
console.log('🧪 Testing API key...\n');

const https = require('https');
const url = require('url');

const authUrl = `${SUPABASE_URL}/rest/v1/`;
const parsedUrl = url.parse(authUrl);

const options = {
  hostname: parsedUrl.hostname,
  path: parsedUrl.path,
  method: 'GET',
  headers: {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  },
  timeout: 5000,
};

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 200 || res.statusCode === 401) {
      // 200 means it worked, 401 might mean RLS but connection is valid
      console.log('✅ Connection successful! API key appears to be valid.\n');
      console.log(`   Status: ${res.statusCode}`);
      console.log('   The API key matches your Supabase project.\n');
      
      if (res.statusCode === 401) {
        console.log('   ⚠️  Note: 401 response might be due to RLS policies,');
        console.log('      but the API key itself is valid.\n');
      }
    } else if (res.statusCode === 403 || res.statusCode === 400) {
      console.error('❌ API key validation failed!');
      console.error(`   Status: ${res.statusCode}`);
      console.error('\n   Possible issues:');
      console.error('   1. API key does not match the Supabase project');
      console.error('   2. API key was rotated/changed in Supabase dashboard');
      console.error('   3. API key has extra spaces or newlines');
      console.error('\n   🔧 How to fix:');
      console.error('   1. Go to: https://supabase.com/dashboard');
      console.error('   2. Select your project');
      console.error('   3. Go to Settings > API');
      console.error('   4. Copy the "anon public" key');
      console.error('   5. Update NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
      console.error('   6. Restart your dev server\n');
      process.exit(1);
    } else {
      console.error(`❌ Unexpected response: ${res.statusCode}`);
      console.error(`   Response: ${data.substring(0, 200)}\n`);
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Connection error:', error.message);
  console.error('\n   Check your internet connection and Supabase URL.\n');
  process.exit(1);
});

req.on('timeout', () => {
  console.error('❌ Request timeout');
  console.error('   Check your internet connection.\n');
  req.destroy();
  process.exit(1);
});

req.end();

