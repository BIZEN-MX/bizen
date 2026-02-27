-- 1. ADD STREAK & ACTIVITY COLUMNS TO PROFILES --
ALTER TABLE "public"."profiles" 
ADD COLUMN IF NOT EXISTS "current_streak" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "longest_streak" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "last_active" TIMESTAMP(3);

-- 2. CREATE DAILY CHALLENGES TABLE --
CREATE TABLE IF NOT EXISTS "public"."daily_challenges" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "challenge_type" TEXT NOT NULL,
    "payload" JSONB,
    "active_date" DATE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "daily_challenges_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "daily_challenges_active_date_idx" ON "public"."daily_challenges"("active_date");

-- 3. CREATE EVIDENCE POSTS TABLE --
CREATE TABLE IF NOT EXISTS "public"."evidence_posts" (
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
);

-- 4. CREATE EVIDENCE REACTIONS TABLE --
CREATE TABLE IF NOT EXISTS "public"."evidence_reactions" (
    "id" TEXT NOT NULL,
    "evidence_post_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "reaction_type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "evidence_reactions_pkey" PRIMARY KEY ("id")
);

-- 5. CREATE EVIDENCE COMMENTS TABLE --
CREATE TABLE IF NOT EXISTS "public"."evidence_comments" (
    "id" TEXT NOT NULL,
    "evidence_post_id" TEXT NOT NULL,
    "parent_comment_id" TEXT,
    "user_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "evidence_comments_pkey" PRIMARY KEY ("id")
);

-- 6. ADD FOREIGN KEY CONSTRAINTS (Safely checking if they exist) --
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
