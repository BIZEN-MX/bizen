const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    console.log('🚀 Starting hierarchy renaming migration...')

    try {
        console.log('🔄 Renaming tables and columns (Topic > Course > Lesson)...')

        // 1. Rename existing 'courses' table to 'topics' first to free up the name
        console.log('  - Renaming courses -> topics')
        await prisma.$executeRawUnsafe(`ALTER TABLE IF EXISTS "courses" RENAME TO "topics";`)

        // 2. Rename 'units' to 'courses'
        console.log('  - Renaming units -> courses')
        await prisma.$executeRawUnsafe(`ALTER TABLE IF EXISTS "units" RENAME COLUMN "course_id" TO "topic_id";`)
        await prisma.$executeRawUnsafe(`ALTER TABLE IF EXISTS "units" RENAME TO "courses";`)

        // 3. Update related columns in other tables
        console.log('  - Updating lessons, sections, enrollments...')
        await prisma.$executeRawUnsafe(`ALTER TABLE IF EXISTS "lessons" RENAME COLUMN "unit_id" TO "course_id";`)
        await prisma.$executeRawUnsafe(`ALTER TABLE IF EXISTS "sections" RENAME COLUMN "unit_id" TO "course_id";`)
        await prisma.$executeRawUnsafe(`ALTER TABLE IF EXISTS "enrollments" RENAME COLUMN "course_id" TO "topic_id";`)
        await prisma.$executeRawUnsafe(`ALTER TABLE IF EXISTS "certificates" RENAME COLUMN "course_id" TO "topic_id";`)

        // 4. Update reviews and school associations
        console.log('  - Updating reviews and school associations...')
        await prisma.$executeRawUnsafe(`ALTER TABLE IF EXISTS "course_reviews" RENAME COLUMN "course_id" TO "topic_id";`)
        await prisma.$executeRawUnsafe(`ALTER TABLE IF EXISTS "course_reviews" RENAME TO "topic_reviews";`)
        await prisma.$executeRawUnsafe(`ALTER TABLE IF EXISTS "school_courses" RENAME COLUMN "course_id" TO "topic_id";`)
        await prisma.$executeRawUnsafe(`ALTER TABLE IF EXISTS "school_courses" RENAME TO "school_topics";`)

        // 5. Update index names for clarity
        console.log('  - Updating index names...')
        await prisma.$executeRawUnsafe(`ALTER INDEX IF EXISTS "idx_lessons_unit" RENAME TO "idx_lessons_course";`)
        await prisma.$executeRawUnsafe(`ALTER INDEX IF EXISTS "idx_sections_unit" RENAME TO "idx_sections_course";`)

        console.log('✅ DB Migration completed successfully')
    } catch (err) {
        console.error('❌ Migration failed:', err)
    } finally {
        await prisma.$disconnect()
    }
}

main()
