-- Forum Tables SQL
-- Run these statements in your PostgreSQL database

-- 0. Profiles table (required for forum foreign keys)
CREATE TABLE IF NOT EXISTS "profiles" (
  "user_id" TEXT PRIMARY KEY,
  "full_name" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'student',
  "school_id" TEXT,
  "xp" INTEGER NOT NULL DEFAULT 0,
  "level" INTEGER NOT NULL DEFAULT 1,
  "nickname" TEXT UNIQUE,
  "reputation" INTEGER NOT NULL DEFAULT 0,
  "posts_created" INTEGER NOT NULL DEFAULT 0,
  "comments_created" INTEGER NOT NULL DEFAULT 0,
  "accepted_answers" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 1. Forum Topics
CREATE TABLE IF NOT EXISTS "forum_topics" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "description" TEXT,
  "icon" TEXT,
  "order_index" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Forum Tags
CREATE TABLE IF NOT EXISTS "forum_tags" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "usage_count" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Forum Threads
CREATE TABLE IF NOT EXISTS "forum_threads" (
  "id" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "author_id" TEXT NOT NULL,
  "topic_id" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'open',
  "accepted_comment_id" TEXT,
  "score" INTEGER NOT NULL DEFAULT 0,
  "view_count" INTEGER NOT NULL DEFAULT 0,
  "comment_count" INTEGER NOT NULL DEFAULT 0,
  "is_pinned" BOOLEAN NOT NULL DEFAULT false,
  "is_hidden" BOOLEAN NOT NULL DEFAULT false,
  "moderation_status" TEXT NOT NULL DEFAULT 'approved',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "forum_threads_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "profiles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "forum_threads_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "forum_topics"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "forum_threads_author_id_idx" ON "forum_threads"("author_id");
CREATE INDEX IF NOT EXISTS "forum_threads_topic_id_idx" ON "forum_threads"("topic_id");
CREATE INDEX IF NOT EXISTS "forum_threads_status_idx" ON "forum_threads"("status");
CREATE INDEX IF NOT EXISTS "forum_threads_created_at_idx" ON "forum_threads"("created_at");
CREATE INDEX IF NOT EXISTS "forum_threads_score_idx" ON "forum_threads"("score");
CREATE INDEX IF NOT EXISTS "forum_threads_moderation_status_idx" ON "forum_threads"("moderation_status");

-- 4. Forum Thread Tags (junction table)
CREATE TABLE IF NOT EXISTS "forum_thread_tags" (
  "thread_id" TEXT NOT NULL,
  "tag_id" TEXT NOT NULL,
  CONSTRAINT "forum_thread_tags_pkey" PRIMARY KEY ("thread_id", "tag_id"),
  CONSTRAINT "forum_thread_tags_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "forum_threads"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "forum_thread_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "forum_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "forum_thread_tags_tag_id_idx" ON "forum_thread_tags"("tag_id");

-- 5. Forum Comments
CREATE TABLE IF NOT EXISTS "forum_comments" (
  "id" TEXT PRIMARY KEY,
  "thread_id" TEXT NOT NULL,
  "parent_comment_id" TEXT,
  "author_id" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "score" INTEGER NOT NULL DEFAULT 0,
  "is_hidden" BOOLEAN NOT NULL DEFAULT false,
  "is_accepted" BOOLEAN NOT NULL DEFAULT false,
  "moderation_status" TEXT NOT NULL DEFAULT 'approved',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "forum_comments_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "forum_threads"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "forum_comments_parent_comment_id_fkey" FOREIGN KEY ("parent_comment_id") REFERENCES "forum_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "forum_comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "profiles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "forum_comments_thread_id_idx" ON "forum_comments"("thread_id");
CREATE INDEX IF NOT EXISTS "forum_comments_parent_comment_id_idx" ON "forum_comments"("parent_comment_id");
CREATE INDEX IF NOT EXISTS "forum_comments_author_id_idx" ON "forum_comments"("author_id");
CREATE INDEX IF NOT EXISTS "forum_comments_created_at_idx" ON "forum_comments"("created_at");

-- 6. Forum Votes
CREATE TABLE IF NOT EXISTS "forum_votes" (
  "id" TEXT PRIMARY KEY,
  "user_id" TEXT NOT NULL,
  "target_type" TEXT NOT NULL,
  "target_id" TEXT NOT NULL,
  "value" INTEGER NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "forum_votes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "forum_votes_user_id_target_type_target_id_key" UNIQUE ("user_id", "target_type", "target_id")
);

CREATE INDEX IF NOT EXISTS "forum_votes_user_id_idx" ON "forum_votes"("user_id");
CREATE INDEX IF NOT EXISTS "forum_votes_target_type_target_id_idx" ON "forum_votes"("target_type", "target_id");

-- 7. Forum Bookmarks
CREATE TABLE IF NOT EXISTS "forum_bookmarks" (
  "user_id" TEXT NOT NULL,
  "thread_id" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "forum_bookmarks_pkey" PRIMARY KEY ("user_id", "thread_id"),
  CONSTRAINT "forum_bookmarks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "forum_bookmarks_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "forum_threads"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "forum_bookmarks_thread_id_idx" ON "forum_bookmarks"("thread_id");

-- 8. Forum Follows
CREATE TABLE IF NOT EXISTS "forum_follows" (
  "user_id" TEXT NOT NULL,
  "thread_id" TEXT NOT NULL,
  "notify_email" BOOLEAN NOT NULL DEFAULT true,
  "notify_in_app" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "forum_follows_pkey" PRIMARY KEY ("user_id", "thread_id"),
  CONSTRAINT "forum_follows_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "forum_follows_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "forum_threads"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "forum_follows_thread_id_idx" ON "forum_follows"("thread_id");

-- 9. Forum Reports
CREATE TABLE IF NOT EXISTS "forum_reports" (
  "id" TEXT PRIMARY KEY,
  "reporter_id" TEXT NOT NULL,
  "target_type" TEXT NOT NULL,
  "target_id" TEXT NOT NULL,
  "reason" TEXT NOT NULL,
  "details" TEXT,
  "status" TEXT NOT NULL DEFAULT 'open',
  "reviewed_by" TEXT,
  "reviewed_at" TIMESTAMP(3),
  "action_taken" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "forum_reports_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "profiles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "forum_reports_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "profiles"("user_id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "forum_reports_reporter_id_idx" ON "forum_reports"("reporter_id");
CREATE INDEX IF NOT EXISTS "forum_reports_target_type_target_id_idx" ON "forum_reports"("target_type", "target_id");
CREATE INDEX IF NOT EXISTS "forum_reports_status_idx" ON "forum_reports"("status");
CREATE INDEX IF NOT EXISTS "forum_reports_created_at_idx" ON "forum_reports"("created_at");

-- 10. Forum Notifications
CREATE TABLE IF NOT EXISTS "forum_notifications" (
  "id" TEXT PRIMARY KEY,
  "user_id" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "data" JSONB NOT NULL,
  "read_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "forum_notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "forum_notifications_user_id_idx" ON "forum_notifications"("user_id");
CREATE INDEX IF NOT EXISTS "forum_notifications_created_at_idx" ON "forum_notifications"("created_at");
CREATE INDEX IF NOT EXISTS "forum_notifications_read_at_idx" ON "forum_notifications"("read_at");

-- 11. Forum Badges
CREATE TABLE IF NOT EXISTS "forum_badges" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "icon" TEXT,
  "requirement_type" TEXT NOT NULL,
  "requirement_value" INTEGER NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 12. Forum User Badges
CREATE TABLE IF NOT EXISTS "forum_user_badges" (
  "user_id" TEXT NOT NULL,
  "badge_id" TEXT NOT NULL,
  "earned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "forum_user_badges_pkey" PRIMARY KEY ("user_id", "badge_id"),
  CONSTRAINT "forum_user_badges_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "forum_user_badges_badge_id_fkey" FOREIGN KEY ("badge_id") REFERENCES "forum_badges"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "forum_user_badges_badge_id_idx" ON "forum_user_badges"("badge_id");

-- Update profiles table if needed (add forum columns if table exists but columns don't)
DO $$ 
BEGIN
  -- Check if profiles table exists first
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'nickname') THEN
      ALTER TABLE "profiles" ADD COLUMN "nickname" TEXT UNIQUE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'reputation') THEN
      ALTER TABLE "profiles" ADD COLUMN "reputation" INTEGER NOT NULL DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'posts_created') THEN
      ALTER TABLE "profiles" ADD COLUMN "posts_created" INTEGER NOT NULL DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'comments_created') THEN
      ALTER TABLE "profiles" ADD COLUMN "comments_created" INTEGER NOT NULL DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'accepted_answers') THEN
      ALTER TABLE "profiles" ADD COLUMN "accepted_answers" INTEGER NOT NULL DEFAULT 0;
    END IF;
  END IF;
END $$;

