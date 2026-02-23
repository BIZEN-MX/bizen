-- ============================================================
-- Daily Challenge + Evidence System
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- 1. Daily Challenges table
CREATE TABLE IF NOT EXISTS daily_challenges (
  id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title           TEXT NOT NULL,
  description     TEXT NOT NULL,
  challenge_type  TEXT NOT NULL,
  payload         JSONB,
  active_date     DATE NOT NULL UNIQUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_daily_challenges_active_date ON daily_challenges(active_date);

-- 2. Evidence Posts table
CREATE TABLE IF NOT EXISTS evidence_posts (
  id                  TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  daily_challenge_id  TEXT NOT NULL REFERENCES daily_challenges(id) ON DELETE CASCADE,
  author_user_id      TEXT NOT NULL,
  school_id           TEXT,
  class_id            TEXT,
  smart_goal          VARCHAR(200) NOT NULL,
  did_today           VARCHAR(300) NOT NULL,
  learned             VARCHAR(300) NOT NULL,
  change_tomorrow     VARCHAR(300) NOT NULL,
  attachments         JSONB,
  status              TEXT NOT NULL DEFAULT 'submitted',
  validated_by        TEXT,
  validated_at        TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_evidence_posts_challenge   ON evidence_posts(daily_challenge_id);
CREATE INDEX IF NOT EXISTS idx_evidence_posts_author      ON evidence_posts(author_user_id);
CREATE INDEX IF NOT EXISTS idx_evidence_posts_school      ON evidence_posts(school_id);
CREATE INDEX IF NOT EXISTS idx_evidence_posts_created     ON evidence_posts(created_at);

-- 3. Evidence Reactions table
CREATE TABLE IF NOT EXISTS evidence_reactions (
  id                TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  evidence_post_id  TEXT NOT NULL REFERENCES evidence_posts(id) ON DELETE CASCADE,
  user_id           TEXT NOT NULL,
  reaction_type     TEXT NOT NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (evidence_post_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_evidence_reactions_post ON evidence_reactions(evidence_post_id);

-- 4. Evidence Comments table
CREATE TABLE IF NOT EXISTS evidence_comments (
  id                TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  evidence_post_id  TEXT NOT NULL REFERENCES evidence_posts(id) ON DELETE CASCADE,
  user_id           TEXT NOT NULL,
  body              VARCHAR(500) NOT NULL,
  parent_comment_id TEXT REFERENCES evidence_comments(id) ON DELETE CASCADE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_evidence_comments_post   ON evidence_comments(evidence_post_id);
CREATE INDEX IF NOT EXISTS idx_evidence_comments_user   ON evidence_comments(user_id);

-- 5. RLS Policies
ALTER TABLE daily_challenges   ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_posts     ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_comments  ENABLE ROW LEVEL SECURITY;

-- daily_challenges: everyone authenticated can read
CREATE POLICY "auth_read_daily_challenges" ON daily_challenges
  FOR SELECT USING (auth.role() = 'authenticated');

-- evidence_posts: students read only from own school
CREATE POLICY "student_read_evidence_own_school" ON evidence_posts
  FOR SELECT USING (
    auth.uid() IS NOT NULL
    AND (
      school_id IS NULL
      OR school_id = (
        SELECT school_id FROM profiles WHERE user_id::text = auth.uid()::text
      )
    )
  );

-- students insert their own evidence
CREATE POLICY "student_insert_evidence" ON evidence_posts
  FOR INSERT WITH CHECK (author_user_id = auth.uid()::text);

-- teachers can update status (validate)
CREATE POLICY "teacher_update_evidence_status" ON evidence_posts
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id::text = auth.uid()::text
        AND role IN ('teacher', 'school_admin', 'admin', 'moderator')
    )
  );

-- reactions: auth read + insert own
CREATE POLICY "auth_read_reactions" ON evidence_reactions
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "auth_insert_reactions" ON evidence_reactions
  FOR INSERT WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "auth_delete_own_reactions" ON evidence_reactions
  FOR DELETE USING (user_id = auth.uid()::text);

CREATE POLICY "auth_update_own_reactions" ON evidence_reactions
  FOR UPDATE USING (user_id = auth.uid()::text);

-- comments: auth read + insert own
CREATE POLICY "auth_read_comments" ON evidence_comments
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "auth_insert_comments" ON evidence_comments
  FOR INSERT WITH CHECK (user_id = auth.uid()::text);
