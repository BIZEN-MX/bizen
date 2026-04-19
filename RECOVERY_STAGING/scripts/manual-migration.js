const { PrismaClient } = require('@prisma/client')

// Using the confirmed working URL
const url = 'postgresql://postgres.qkrttsukyuujjovrjhjk:Yeyo.312603.@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require'

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: url
        }
    }
})

async function main() {
    console.log('🚀 Starting manual migration...')

    try {
        // 1. Update School table
        console.log('🔄 Updating schools table...')
        await prisma.$executeRawUnsafe(`ALTER TABLE "schools" ADD COLUMN IF NOT EXISTS "region" TEXT;`)
        await prisma.$executeRawUnsafe(`ALTER TABLE "schools" ADD COLUMN IF NOT EXISTS "contact_email" TEXT;`)

        // 2. Create License
        console.log('📦 Creating licenses table...')
        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "licenses" (
        "id" TEXT NOT NULL,
        "school_id" TEXT NOT NULL,
        "plan" TEXT NOT NULL,
        "seats" INTEGER NOT NULL,
        "status" TEXT NOT NULL,
        "start_date" TIMESTAMP(3) NOT NULL,
        "end_date" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "licenses_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "licenses_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `)

        // 3. Create Course
        console.log('📦 Creating courses table...')
        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "courses" (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "description" TEXT,
        "level" TEXT NOT NULL,
        "is_active" BOOLEAN NOT NULL DEFAULT true,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
      );
    `)

        // 4. Create SchoolCourse
        console.log('📦 Creating school_courses table...')
        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "school_courses" (
        "school_id" TEXT NOT NULL,
        "course_id" TEXT NOT NULL,
        "is_enabled" BOOLEAN NOT NULL DEFAULT true,
        CONSTRAINT "school_courses_pkey" PRIMARY KEY ("school_id", "course_id"),
        CONSTRAINT "school_courses_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "school_courses_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `)

        // 5. Create Unit
        console.log('📦 Creating units table...')
        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "units" (
        "id" TEXT NOT NULL,
        "course_id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "order" INTEGER NOT NULL,
        "is_locked" BOOLEAN NOT NULL DEFAULT false,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "units_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "units_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `)

        // 6. Create Lesson
        console.log('📦 Creating lessons table...')
        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "lessons" (
        "id" TEXT NOT NULL,
        "unit_id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "content_type" TEXT NOT NULL,
        "order" INTEGER NOT NULL,
        "xp_reward" INTEGER NOT NULL DEFAULT 50,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "lessons_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "lessons_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `)

        // 7. Create Quiz
        console.log('📦 Creating quizzes table...')
        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "quizzes" (
        "id" TEXT NOT NULL,
        "lesson_id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "pass_score" INTEGER NOT NULL,
        "total_points" INTEGER NOT NULL,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "quizzes_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "quizzes_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `)

        // 8. Create Question
        console.log('📦 Creating questions table...')
        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "questions" (
        "id" TEXT NOT NULL,
        "quiz_id" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "prompt" TEXT NOT NULL,
        "order" INTEGER NOT NULL,
        CONSTRAINT "questions_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "questions_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `)

        // 9. Create Option
        console.log('📦 Creating options table...')
        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "options" (
        "id" TEXT NOT NULL,
        "question_id" TEXT NOT NULL,
        "text" TEXT NOT NULL,
        "is_correct" BOOLEAN NOT NULL,
        CONSTRAINT "options_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "options_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `)

        console.log('✅ Migration completed successfully')
    } catch (err) {
        console.error('❌ Migration failed:', err)
    } finally {
        await prisma.$disconnect()
    }
}

main()
