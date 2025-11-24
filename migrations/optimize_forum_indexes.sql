-- Add composite indexes to optimize forum queries
-- These indexes will significantly improve query performance for forum threads and comments

-- Index for filtering comments by thread, moderation status, and parent
CREATE INDEX IF NOT EXISTS idx_forum_comments_thread_moderation_parent 
ON forum_comments(thread_id, moderation_status, is_hidden, parent_comment_id);

-- Index for ordering comments by score and creation date
CREATE INDEX IF NOT EXISTS idx_forum_comments_score_created 
ON forum_comments(score DESC, created_at ASC);

-- Index for filtering threads by topic and moderation status
CREATE INDEX IF NOT EXISTS idx_forum_threads_topic_moderation 
ON forum_threads(topic_id, moderation_status, is_hidden);

-- Index for ordering threads by pinned status, score, and creation date
CREATE INDEX IF NOT EXISTS idx_forum_threads_pinned_score_created 
ON forum_threads(is_pinned DESC, score DESC, created_at DESC);

-- Index for filtering comments by parent and moderation status (for replies)
CREATE INDEX IF NOT EXISTS idx_forum_comments_parent_moderation 
ON forum_comments(parent_comment_id, moderation_status, is_hidden) 
WHERE parent_comment_id IS NOT NULL;

-- Index for votes lookup by user and target
CREATE INDEX IF NOT EXISTS idx_forum_votes_user_target 
ON forum_votes(user_id, target_type, target_id);

-- Index for comments by thread and accepted status (for accepted answers)
CREATE INDEX IF NOT EXISTS idx_forum_comments_thread_accepted 
ON forum_comments(thread_id, is_accepted DESC) 
WHERE is_accepted = true;

