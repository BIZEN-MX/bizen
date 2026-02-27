const { PrismaClient } = require('@prisma/client');

async function main() {
    console.log("Running safe database adjustments...");
    const prisma = new PrismaClient();
    try {
        await prisma.$executeRawUnsafe(`ALTER TABLE "public"."profiles" ADD COLUMN IF NOT EXISTS "current_streak" INTEGER NOT NULL DEFAULT 0;`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "public"."profiles" ADD COLUMN IF NOT EXISTS "longest_streak" INTEGER NOT NULL DEFAULT 0;`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "public"."profiles" ADD COLUMN IF NOT EXISTS "last_active" TIMESTAMP(3);`);
        console.log("Profiles updated.");

        await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "public"."daily_challenges" (
            "id" TEXT NOT NULL,
            "title" TEXT NOT NULL,
            "description" TEXT,
            "challenge_type" TEXT NOT NULL,
            "payload" JSONB,
            "active_date" DATE NOT NULL,
            "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "daily_challenges_pkey" PRIMARY KEY ("id")
        )`);
        await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "daily_challenges_active_date_idx" ON "public"."daily_challenges"("active_date")`);
        console.log("daily_challenges created.");

        await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "public"."evidence_posts" (
            "id" TEXT NOT NULL,
            "daily_challenge_id" TEXT,
            "class_id" TEXT,
            "author_user_id" TEXT NOT NULL,
            "school_id" TEXT,
            "content" TEXT NOT NULL,
            "image_urls" TEXT[],
            "is_validated" BOOLEAN NOT NULL DEFAULT false,
            "validated_by" TEXT,
            "validated_at" TIMESTAMP(3),
            "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "evidence_posts_pkey" PRIMARY KEY ("id")
        )`);
        console.log("evidence_posts created.");

        await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "public"."evidence_reactions" (
            "id" TEXT NOT NULL,
            "evidence_post_id" TEXT NOT NULL,
            "user_id" TEXT NOT NULL,
            "reaction_type" TEXT NOT NULL,
            "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "evidence_reactions_pkey" PRIMARY KEY ("id")
        )`);

        await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "public"."evidence_comments" (
            "id" TEXT NOT NULL,
            "evidence_post_id" TEXT NOT NULL,
            "parent_comment_id" TEXT,
            "user_id" TEXT NOT NULL,
            "content" TEXT NOT NULL,
            "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "evidence_comments_pkey" PRIMARY KEY ("id")
        )`);

        const fkSql = `
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'evidence_posts_daily_challenge_id_fkey') THEN
                ALTER TABLE "public"."evidence_posts" ADD CONSTRAINT "evidence_posts_daily_challenge_id_fkey" FOREIGN KEY ("daily_challenge_id") REFERENCES "public"."daily_challenges"("id") ON DELETE CASCADE ON UPDATE CASCADE;
            END IF;
            IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'evidence_posts_author_user_id_fkey') THEN
                ALTER TABLE "public"."evidence_posts" ADD CONSTRAINT "evidence_posts_author_user_id_fkey" FOREIGN KEY ("author_user_id") REFERENCES "public"."profiles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
            END IF;
            IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'evidence_reactions_evidence_post_id_fkey') THEN
                ALTER TABLE "public"."evidence_reactions" ADD CONSTRAINT "evidence_reactions_evidence_post_id_fkey" FOREIGN KEY ("evidence_post_id") REFERENCES "public"."evidence_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
            END IF;
            IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'evidence_comments_evidence_post_id_fkey') THEN
                ALTER TABLE "public"."evidence_comments" ADD CONSTRAINT "evidence_comments_evidence_post_id_fkey" FOREIGN KEY ("evidence_post_id") REFERENCES "public"."evidence_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
            END IF;
        END $$;
        `;
        await prisma.$executeRawUnsafe(fkSql);
        console.log("Foreign keys enforced cleanly.");

    } catch (e) {
        console.error("Migration failed to execute:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
