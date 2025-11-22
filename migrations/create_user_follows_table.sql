-- ===================================================================
-- CREATE USER FOLLOWS TABLE
-- ===================================================================
-- This creates a table to track user-to-user follows
-- Run this SQL in your Supabase Dashboard → SQL Editor
-- ===================================================================

-- Create user_follows table
CREATE TABLE IF NOT EXISTS user_follows (
  follower_id TEXT NOT NULL,
  following_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  
  PRIMARY KEY (follower_id, following_id),
  CONSTRAINT user_follows_follower_fkey 
    FOREIGN KEY (follower_id) REFERENCES profiles(user_id) ON DELETE CASCADE,
  CONSTRAINT user_follows_following_fkey 
    FOREIGN KEY (following_id) REFERENCES profiles(user_id) ON DELETE CASCADE,
  CONSTRAINT user_follows_no_self_follow 
    CHECK (follower_id != following_id)
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS user_follows_follower_idx ON user_follows(follower_id);
CREATE INDEX IF NOT EXISTS user_follows_following_idx ON user_follows(following_id);
CREATE INDEX IF NOT EXISTS user_follows_created_at_idx ON user_follows(created_at);

-- ===================================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ===================================================================
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;

-- ===================================================================
-- RLS POLICIES
-- ===================================================================

-- Public can view all follows (for displaying follower/following counts)
DROP POLICY IF EXISTS "Public can view follows" ON user_follows;
CREATE POLICY "Public can view follows"
  ON user_follows FOR SELECT
  USING (true);

-- Authenticated users can create follows (follow other users)
DROP POLICY IF EXISTS "Authenticated users can create follows" ON user_follows;
CREATE POLICY "Authenticated users can create follows"
  ON user_follows FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = follower_id);

-- Users can delete their own follows (unfollow)
DROP POLICY IF EXISTS "Users can delete own follows" ON user_follows;
CREATE POLICY "Users can delete own follows"
  ON user_follows FOR DELETE
  TO authenticated
  USING (auth.uid()::text = follower_id);

-- Service role bypass for admin operations
DROP POLICY IF EXISTS "Service role bypass for user_follows" ON user_follows;
CREATE POLICY "Service role bypass for user_follows"
  ON user_follows FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ===================================================================
-- VERIFICATION QUERIES
-- ===================================================================
-- Run these to verify the table was created correctly

-- Check if table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'user_follows';

-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename = 'user_follows';

-- Check policies
SELECT schemaname, tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename = 'user_follows'
ORDER BY policyname;

-- ===================================================================
-- DONE! 🎉
-- ===================================================================
-- The user_follows table is now ready to track user-to-user follows
-- ===================================================================

