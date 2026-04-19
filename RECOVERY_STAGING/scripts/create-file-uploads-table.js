const { PrismaClient } = require('@prisma/client');

async function createFileUploadsTable() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔄 Creating file_uploads table...');
    
    // Create the table using raw SQL
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS file_uploads (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        user_id TEXT NOT NULL,
        original_name TEXT NOT NULL,
        filename TEXT NOT NULL,
        title TEXT,
        notes TEXT,
        size INTEGER NOT NULL,
        type TEXT NOT NULL,
        path TEXT NOT NULL,
        uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    
    console.log('✅ file_uploads table created successfully!');
    
    // Create indexes
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS idx_file_uploads_user_id ON file_uploads(user_id);
    `;
    
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS idx_file_uploads_uploaded_at ON file_uploads(uploaded_at);
    `;
    
    console.log('✅ Indexes created successfully!');
    
    // Test the table
    const count = await prisma.$queryRaw`SELECT COUNT(*) FROM file_uploads`;
    console.log('📊 Table is ready. Current records:', count[0].count);
    
  } catch (error) {
    console.error('❌ Error creating table:', error.message);
    
    if (error.message.includes('relation "file_uploads" already exists')) {
      console.log('✅ Table already exists!');
    } else {
      console.log('\n🔧 Manual fix needed:');
      console.log('1. Check your database connection');
      console.log('2. Ensure you have CREATE TABLE permissions');
      console.log('3. Try running: npx prisma db push');
    }
  } finally {
    await prisma.$disconnect();
  }
}

createFileUploadsTable();
