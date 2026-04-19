#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up file storage system...\n');

// 1. Create uploads directory
const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'module6');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Created uploads directory:', uploadsDir);
} else {
  console.log('📁 Uploads directory already exists:', uploadsDir);
}

// 2. Run Prisma migration
try {
  console.log('\n🔄 Running Prisma migration...');
  execSync('npx prisma db push', { stdio: 'inherit' });
  console.log('✅ Database schema updated');
} catch (error) {
  console.log('⚠️  Prisma migration failed. You may need to run it manually:');
  console.log('   npx prisma db push');
}

// 3. Generate Prisma client
try {
  console.log('\n🔄 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated');
} catch (error) {
  console.log('⚠️  Prisma client generation failed. You may need to run it manually:');
  console.log('   npx prisma generate');
}

console.log('\n🎉 File storage setup complete!');
console.log('\n📋 Next steps:');
console.log('1. Files will be stored in:', uploadsDir);
console.log('2. Database metadata will be stored in the file_uploads table');
console.log('3. View uploaded files at: http://localhost:3000/admin/files');
console.log('4. Test file upload at: http://localhost:3000/module/6/section/1/page/3');

console.log('\n🔧 Manual setup (if needed):');
console.log('1. Run migration: npx prisma db push');
console.log('2. Generate client: npx prisma generate');
console.log('3. Start dev server: npm run dev');
