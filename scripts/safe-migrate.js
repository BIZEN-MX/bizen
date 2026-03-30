const { PrismaClient } = require('@prisma/client');

async function main() {
    console.log("Running safe database adjustments...");
    const prisma = new PrismaClient();
    try {
        await prisma.$executeRawUnsafe(`ALTER TABLE "public"."profiles" ADD COLUMN IF NOT EXISTS "current_streak" INTEGER DEFAULT 0;`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "public"."profiles" ADD COLUMN IF NOT EXISTS "longest_streak" INTEGER DEFAULT 0;`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "public"."profiles" ADD COLUMN IF NOT EXISTS "last_active" TIMESTAMP(3);`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "public"."profiles" ADD COLUMN IF NOT EXISTS "bizcoins" INTEGER DEFAULT 0;`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "public"."profiles" ADD COLUMN IF NOT EXISTS "is_minor" BOOLEAN DEFAULT false;`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "public"."profiles" ADD COLUMN IF NOT EXISTS "parental_override" BOOLEAN DEFAULT false;`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "public"."profiles" ADD COLUMN IF NOT EXISTS "subscription_status" TEXT DEFAULT 'none';`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "public"."profiles" ADD COLUMN IF NOT EXISTS "reputation" INTEGER DEFAULT 0;`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "public"."profiles" ADD COLUMN IF NOT EXISTS "posts_created" INTEGER DEFAULT 0;`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "public"."profiles" ADD COLUMN IF NOT EXISTS "comments_created" INTEGER DEFAULT 0;`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "public"."profiles" ADD COLUMN IF NOT EXISTS "accepted_answers" INTEGER DEFAULT 0;`);
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

        await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "public"."user_inventory" (
          "id" TEXT PRIMARY KEY,
          "user_id" TEXT NOT NULL REFERENCES "public"."profiles"("user_id") ON DELETE CASCADE,
          "product_id" TEXT NOT NULL,
          "purchased_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          "price_paid" INTEGER NOT NULL DEFAULT 0
        );`);
        await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_user_inventory_user_id ON "public"."user_inventory"("user_id");`);
        console.log("user_inventory created.");

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

        await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "public"."wallet_transactions" (
            "id" TEXT NOT NULL,
            "user_id" TEXT NOT NULL,
            "amount" INTEGER NOT NULL,
            "type" TEXT NOT NULL,
            "category" TEXT NOT NULL,
            "description" TEXT NOT NULL,
            "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "wallet_transactions_pkey" PRIMARY KEY ("id"),
            CONSTRAINT "wallet_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE
        )`);
        await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "wallet_transactions_user_id_idx" ON "public"."wallet_transactions"("user_id")`);

        await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "public"."savings_goals" (
            "id" TEXT NOT NULL,
            "user_id" TEXT NOT NULL,
            "title" TEXT NOT NULL,
            "target_amount" INTEGER NOT NULL,
            "category" TEXT,
            "is_completed" BOOLEAN DEFAULT false,
            "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "savings_goals_pkey" PRIMARY KEY ("id"),
            CONSTRAINT "savings_goals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE
        )`);
        await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "savings_goals_user_id_idx" ON "public"."savings_goals"("user_id")`);

        await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "public"."staking_positions" (
            "id" TEXT NOT NULL,
            "user_id" TEXT NOT NULL,
            "amount" INTEGER NOT NULL,
            "yield_rate" DOUBLE PRECISION NOT NULL,
            "start_date" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "end_date" TIMESTAMPTZ(6) NOT NULL,
            "status" TEXT DEFAULT 'active',
            "earned_amount" INTEGER,
            CONSTRAINT "staking_positions_pkey" PRIMARY KEY ("id"),
            CONSTRAINT "staking_positions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE
        )`);
        await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "staking_positions_user_id_idx" ON "public"."staking_positions"("user_id")`);
        console.log("wallet, savings and staking tables verified.");

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
