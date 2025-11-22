-- ===================================================================
-- ENABLE RLS FOR FORUM TABLES
-- ===================================================================
-- This enables Row Level Security on all forum tables and creates
-- appropriate policies for public viewing and authenticated user actions
-- Run this SQL in your Supabase Dashboard → SQL Editor
-- ===================================================================

-- Enable RLS on all forum tables
ALTER TABLE forum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_thread_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_blocked_content ENABLE ROW LEVEL SECURITY;

-- ===================================================================
-- FORUM TOPICS POLICIES
-- ===================================================================
-- Public read access, authenticated users can view all
DROP POLICY IF EXISTS "Public can view topics" ON forum_topics;
CREATE POLICY "Public can view topics"
  ON forum_topics FOR SELECT
  USING (true);

-- Service role bypass
DROP POLICY IF EXISTS "Service role bypass for forum_topics" ON forum_topics;
CREATE POLICY "Service role bypass for forum_topics"
  ON forum_topics FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ===================================================================
-- FORUM TAGS POLICIES
-- ===================================================================
-- Public read access
DROP POLICY IF EXISTS "Public can view tags" ON forum_tags;
CREATE POLICY "Public can view tags"
  ON forum_tags FOR SELECT
  USING (true);

-- Service role bypass
DROP POLICY IF EXISTS "Service role bypass for forum_tags" ON forum_tags;
CREATE POLICY "Service role bypass for forum_tags"
  ON forum_tags FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ===================================================================
-- FORUM THREADS POLICIES
-- ===================================================================
-- Public can view approved threads (not hidden)
DROP POLICY IF EXISTS "Public can view approved threads" ON forum_threads;
CREATE POLICY "Public can view approved threads"
  ON forum_threads FOR SELECT
  USING (moderation_status = 'approved' AND is_hidden = false);

-- Authenticated users can view their own threads (even if hidden)
DROP POLICY IF EXISTS "Users can view own threads" ON forum_threads;
CREATE POLICY "Users can view own threads"
  ON forum_threads FOR SELECT
  USING (auth.uid()::text = author_id);

-- Authenticated users can create threads
DROP POLICY IF EXISTS "Authenticated users can create threads" ON forum_threads;
CREATE POLICY "Authenticated users can create threads"
  ON forum_threads FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = author_id);

-- Users can update their own threads
DROP POLICY IF EXISTS "Users can update own threads" ON forum_threads;
CREATE POLICY "Users can update own threads"
  ON forum_threads FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = author_id)
  WITH CHECK (auth.uid()::text = author_id);

-- Users can delete their own threads
DROP POLICY IF EXISTS "Users can delete own threads" ON forum_threads;
CREATE POLICY "Users can delete own threads"
  ON forum_threads FOR DELETE
  TO authenticated
  USING (auth.uid()::text = author_id);

-- Service role bypass
DROP POLICY IF EXISTS "Service role bypass for forum_threads" ON forum_threads;
CREATE POLICY "Service role bypass for forum_threads"
  ON forum_threads FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ===================================================================
-- FORUM THREAD TAGS POLICIES
-- ===================================================================
-- Public can view thread tags
DROP POLICY IF EXISTS "Public can view thread tags" ON forum_thread_tags;
CREATE POLICY "Public can view thread tags"
  ON forum_thread_tags FOR SELECT
  USING (true);

-- Authenticated users can manage tags on their own threads
DROP POLICY IF EXISTS "Users can manage tags on own threads" ON forum_thread_tags;
CREATE POLICY "Users can manage tags on own threads"
  ON forum_thread_tags FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM forum_threads
      WHERE forum_threads.id = forum_thread_tags.thread_id
      AND forum_threads.author_id = auth.uid()::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM forum_threads
      WHERE forum_threads.id = forum_thread_tags.thread_id
      AND forum_threads.author_id = auth.uid()::text
    )
  );

-- Service role bypass
DROP POLICY IF EXISTS "Service role bypass for forum_thread_tags" ON forum_thread_tags;
CREATE POLICY "Service role bypass for forum_thread_tags"
  ON forum_thread_tags FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ===================================================================
-- FORUM COMMENTS POLICIES
-- ===================================================================
-- Public can view approved comments (not hidden)
DROP POLICY IF EXISTS "Public can view approved comments" ON forum_comments;
CREATE POLICY "Public can view approved comments"
  ON forum_comments FOR SELECT
  USING (moderation_status = 'approved' AND is_hidden = false);

-- Authenticated users can view their own comments (even if hidden)
DROP POLICY IF EXISTS "Users can view own comments" ON forum_comments;
CREATE POLICY "Users can view own comments"
  ON forum_comments FOR SELECT
  USING (auth.uid()::text = author_id);

-- Authenticated users can create comments
DROP POLICY IF EXISTS "Authenticated users can create comments" ON forum_comments;
CREATE POLICY "Authenticated users can create comments"
  ON forum_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = author_id);

-- Users can update their own comments
DROP POLICY IF EXISTS "Users can update own comments" ON forum_comments;
CREATE POLICY "Users can update own comments"
  ON forum_comments FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = author_id)
  WITH CHECK (auth.uid()::text = author_id);

-- Users can delete their own comments
DROP POLICY IF EXISTS "Users can delete own comments" ON forum_comments;
CREATE POLICY "Users can delete own comments"
  ON forum_comments FOR DELETE
  TO authenticated
  USING (auth.uid()::text = author_id);

-- Service role bypass
DROP POLICY IF EXISTS "Service role bypass for forum_comments" ON forum_comments;
CREATE POLICY "Service role bypass for forum_comments"
  ON forum_comments FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ===================================================================
-- FORUM VOTES POLICIES
-- ===================================================================
-- Public can view votes (for transparency)
DROP POLICY IF EXISTS "Public can view votes" ON forum_votes;
CREATE POLICY "Public can view votes"
  ON forum_votes FOR SELECT
  USING (true);

-- Authenticated users can create votes
DROP POLICY IF EXISTS "Authenticated users can create votes" ON forum_votes;
CREATE POLICY "Authenticated users can create votes"
  ON forum_votes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

-- Users can update their own votes
DROP POLICY IF EXISTS "Users can update own votes" ON forum_votes;
CREATE POLICY "Users can update own votes"
  ON forum_votes FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- Users can delete their own votes
DROP POLICY IF EXISTS "Users can delete own votes" ON forum_votes;
CREATE POLICY "Users can delete own votes"
  ON forum_votes FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id);

-- Service role bypass
DROP POLICY IF EXISTS "Service role bypass for forum_votes" ON forum_votes;
CREATE POLICY "Service role bypass for forum_votes"
  ON forum_votes FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ===================================================================
-- FORUM BOOKMARKS POLICIES
-- ===================================================================
-- Users can only view their own bookmarks
DROP POLICY IF EXISTS "Users can view own bookmarks" ON forum_bookmarks;
CREATE POLICY "Users can view own bookmarks"
  ON forum_bookmarks FOR SELECT
  USING (auth.uid()::text = user_id);

-- Users can create their own bookmarks
DROP POLICY IF EXISTS "Users can create own bookmarks" ON forum_bookmarks;
CREATE POLICY "Users can create own bookmarks"
  ON forum_bookmarks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

-- Users can delete their own bookmarks
DROP POLICY IF EXISTS "Users can delete own bookmarks" ON forum_bookmarks;
CREATE POLICY "Users can delete own bookmarks"
  ON forum_bookmarks FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id);

-- Service role bypass
DROP POLICY IF EXISTS "Service role bypass for forum_bookmarks" ON forum_bookmarks;
CREATE POLICY "Service role bypass for forum_bookmarks"
  ON forum_bookmarks FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ===================================================================
-- FORUM FOLLOWS POLICIES
-- ===================================================================
-- Users can only view their own follows
DROP POLICY IF EXISTS "Users can view own follows" ON forum_follows;
CREATE POLICY "Users can view own follows"
  ON forum_follows FOR SELECT
  USING (auth.uid()::text = user_id);

-- Users can create their own follows
DROP POLICY IF EXISTS "Users can create own follows" ON forum_follows;
CREATE POLICY "Users can create own follows"
  ON forum_follows FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

-- Users can update their own follows
DROP POLICY IF EXISTS "Users can update own follows" ON forum_follows;
CREATE POLICY "Users can update own follows"
  ON forum_follows FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- Users can delete their own follows
DROP POLICY IF EXISTS "Users can delete own follows" ON forum_follows;
CREATE POLICY "Users can delete own follows"
  ON forum_follows FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id);

-- Service role bypass
DROP POLICY IF EXISTS "Service role bypass for forum_follows" ON forum_follows;
CREATE POLICY "Service role bypass for forum_follows"
  ON forum_follows FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ===================================================================
-- FORUM REPORTS POLICIES
-- ===================================================================
-- Users can view their own reports
DROP POLICY IF EXISTS "Users can view own reports" ON forum_reports;
CREATE POLICY "Users can view own reports"
  ON forum_reports FOR SELECT
  USING (auth.uid()::text = reporter_id);

-- Users can create reports
DROP POLICY IF EXISTS "Authenticated users can create reports" ON forum_reports;
CREATE POLICY "Authenticated users can create reports"
  ON forum_reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = reporter_id);

-- Service role bypass (for moderators to review reports)
DROP POLICY IF EXISTS "Service role bypass for forum_reports" ON forum_reports;
CREATE POLICY "Service role bypass for forum_reports"
  ON forum_reports FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ===================================================================
-- FORUM NOTIFICATIONS POLICIES
-- ===================================================================
-- Users can only view their own notifications
DROP POLICY IF EXISTS "Users can view own notifications" ON forum_notifications;
CREATE POLICY "Users can view own notifications"
  ON forum_notifications FOR SELECT
  USING (auth.uid()::text = user_id);

-- Users can update their own notifications (mark as read)
DROP POLICY IF EXISTS "Users can update own notifications" ON forum_notifications;
CREATE POLICY "Users can update own notifications"
  ON forum_notifications FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- Service role can create notifications (for system notifications)
DROP POLICY IF EXISTS "Service role bypass for forum_notifications" ON forum_notifications;
CREATE POLICY "Service role bypass for forum_notifications"
  ON forum_notifications FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ===================================================================
-- FORUM BADGES POLICIES
-- ===================================================================
-- Public can view badges
DROP POLICY IF EXISTS "Public can view badges" ON forum_badges;
CREATE POLICY "Public can view badges"
  ON forum_badges FOR SELECT
  USING (true);

-- Service role bypass
DROP POLICY IF EXISTS "Service role bypass for forum_badges" ON forum_badges;
CREATE POLICY "Service role bypass for forum_badges"
  ON forum_badges FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ===================================================================
-- FORUM USER BADGES POLICIES
-- ===================================================================
-- Public can view user badges
DROP POLICY IF EXISTS "Public can view user badges" ON forum_user_badges;
CREATE POLICY "Public can view user badges"
  ON forum_user_badges FOR SELECT
  USING (true);

-- Service role bypass (for awarding badges)
DROP POLICY IF EXISTS "Service role bypass for forum_user_badges" ON forum_user_badges;
CREATE POLICY "Service role bypass for forum_user_badges"
  ON forum_user_badges FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ===================================================================
-- FORUM RATE LIMITS POLICIES
-- ===================================================================
-- Service role only (internal tracking)
DROP POLICY IF EXISTS "Service role bypass for forum_rate_limits" ON forum_rate_limits;
CREATE POLICY "Service role bypass for forum_rate_limits"
  ON forum_rate_limits FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ===================================================================
-- FORUM BLOCKED CONTENT POLICIES
-- ===================================================================
-- Service role only (admin content moderation)
DROP POLICY IF EXISTS "Service role bypass for forum_blocked_content" ON forum_blocked_content;
CREATE POLICY "Service role bypass for forum_blocked_content"
  ON forum_blocked_content FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ===================================================================
-- VERIFICATION QUERIES
-- ===================================================================
-- Run these to verify RLS is enabled and policies are created

-- Check if RLS is enabled on forum tables
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename LIKE 'forum_%'
ORDER BY tablename;

-- Check policies
SELECT schemaname, tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename LIKE 'forum_%'
ORDER BY tablename, policyname;

-- ===================================================================
-- DONE! 🎉
-- ===================================================================
-- All forum tables now have RLS enabled with appropriate policies:
-- - Public can view topics, tags, approved threads/comments
-- - Authenticated users can create and manage their own content
-- - Users can only access their own bookmarks, follows, notifications
-- - Service role has full access for admin operations
-- ===================================================================

