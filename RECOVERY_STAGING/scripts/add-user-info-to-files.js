const { PrismaClient } = require('@prisma/client');

async function addUserInfoColumns() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔄 Adding user name and email columns to file_uploads table...');
    
    // Add user_name column
    await prisma.$executeRaw`
      ALTER TABLE file_uploads 
      ADD COLUMN IF NOT EXISTS user_name TEXT;
    `;
    console.log('✅ Added user_name column');
    
    // Add user_email column
    await prisma.$executeRaw`
      ALTER TABLE file_uploads 
      ADD COLUMN IF NOT EXISTS user_email TEXT;
    `;
    console.log('✅ Added user_email column');
    
    // Add comments for documentation
    await prisma.$executeRaw`
      COMMENT ON COLUMN file_uploads.user_name IS 'Display name of the user who uploaded the file';
    `;
    
    await prisma.$executeRaw`
      COMMENT ON COLUMN file_uploads.user_email IS 'Email address of the user who uploaded the file';
    `;
    
    console.log('✅ Added column comments');
    
    console.log('\n🎉 User info columns added successfully!');
    console.log('📋 New columns:');
    console.log('• user_name: Display name of the uploader');
    console.log('• user_email: Email address of the uploader');
    
  } catch (error) {
    console.error('❌ Error adding columns:', error.message);
    
    if (error.message.includes('already exists')) {
      console.log('✅ Columns already exist');
    } else {
      console.log('\n🔧 Manual setup needed:');
      console.log('1. Run: ALTER TABLE file_uploads ADD COLUMN user_name TEXT;');
      console.log('2. Run: ALTER TABLE file_uploads ADD COLUMN user_email TEXT;');
    }
  } finally {
    await prisma.$disconnect();
  }
}

addUserInfoColumns();
