-- =====================================================
-- BIZEN ENTREPRENEUR FORUM - Advanced Schema
-- =====================================================
-- Stack: Supabase (Postgres + RLS), Next.js, TypeScript
-- Safety: Text-only, no images, no file uploads
-- Privacy: Pseudonyms for students, no DMs for under 18
-- =====================================================
-- 
-- IMPORTANT: This SQL creates standalone forum tables
-- Foreign keys to profiles table are removed for initial setup
-- After running this, you'll need to:
-- 1. Run Prisma migrations to create/update profiles table
-- 2. Then manually add foreign keys if needed
--
-- =====================================================

-- =====================================================
-- CLEANUP: Drop old forum tables if they exist
-- =====================================================
DROP TABLE IF EXISTS forum_reply_likes CASCADE;
DROP TABLE IF EXISTS forum_topic_likes CASCADE;
DROP TABLE IF EXISTS forum_replies CASCADE;
DROP TABLE IF EXISTS forum_categories CASCADE;
DROP TABLE IF EXISTS forum_user_badges CASCADE;
DROP TABLE IF EXISTS forum_rate_limits CASCADE;
DROP TABLE IF EXISTS forum_blocked_content CASCADE;
DROP TABLE IF EXISTS forum_notifications CASCADE;
DROP TABLE IF EXISTS forum_reports CASCADE;
DROP TABLE IF EXISTS forum_follows CASCADE;
DROP TABLE IF EXISTS forum_bookmarks CASCADE;
DROP TABLE IF EXISTS forum_votes CASCADE;
DROP TABLE IF EXISTS forum_thread_tags CASCADE;
DROP TABLE IF EXISTS forum_comments CASCADE;
DROP TABLE IF EXISTS forum_threads CASCADE;
DROP TABLE IF EXISTS forum_tags CASCADE;
DROP TABLE IF EXISTS forum_badges CASCADE;
DROP TABLE IF EXISTS forum_topics CASCADE;

-- =====================================================
-- 1. SCHOOLS TABLE (if not exists)
-- =====================================================
CREATE TABLE IF NOT EXISTS schools (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 2. PROFILES TABLE (Enhanced for Forum)
-- =====================================================
-- Note: Run this separately if profiles table already exists
-- ALTER TABLE profiles 
-- ADD COLUMN IF NOT EXISTS nickname TEXT,
-- ADD COLUMN IF NOT EXISTS reputation INTEGER NOT NULL DEFAULT 0,
-- ADD COLUMN IF NOT EXISTS school_id TEXT REFERENCES schools(id),
-- ADD COLUMN IF NOT EXISTS posts_created INTEGER NOT NULL DEFAULT 0,
-- ADD COLUMN IF NOT EXISTS comments_created INTEGER NOT NULL DEFAULT 0,
-- ADD COLUMN IF NOT EXISTS accepted_answers INTEGER NOT NULL DEFAULT 0;

-- CREATE UNIQUE INDEX IF NOT EXISTS profiles_nickname_key ON profiles(nickname);

-- =====================================================
-- 3. TOPICS (Categories)
-- =====================================================
CREATE TABLE IF NOT EXISTS forum_topics (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 4. TAGS
-- =====================================================
CREATE TABLE IF NOT EXISTS forum_tags (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    usage_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 5. THREADS (Posts)
-- =====================================================
CREATE TABLE IF NOT EXISTS forum_threads (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    author_id TEXT NOT NULL,
    topic_id TEXT NOT NULL REFERENCES forum_topics(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('open', 'resolved', 'locked')) DEFAULT 'open',
    accepted_comment_id TEXT,
    score INTEGER NOT NULL DEFAULT 0,
    view_count INTEGER NOT NULL DEFAULT 0,
    comment_count INTEGER NOT NULL DEFAULT 0,
    is_pinned BOOLEAN NOT NULL DEFAULT false,
    is_hidden BOOLEAN NOT NULL DEFAULT false,
    moderation_status TEXT CHECK (moderation_status IN ('pending', 'approved', 'rejected')) DEFAULT 'approved',
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for threads
CREATE INDEX IF NOT EXISTS forum_threads_author_id_idx ON forum_threads(author_id);
CREATE INDEX IF NOT EXISTS forum_threads_topic_id_idx ON forum_threads(topic_id);
CREATE INDEX IF NOT EXISTS forum_threads_status_idx ON forum_threads(status);
CREATE INDEX IF NOT EXISTS forum_threads_created_at_idx ON forum_threads(created_at DESC);
CREATE INDEX IF NOT EXISTS forum_threads_score_idx ON forum_threads(score DESC);
CREATE INDEX IF NOT EXISTS forum_threads_moderation_status_idx ON forum_threads(moderation_status);

-- Full text search index
CREATE INDEX IF NOT EXISTS forum_threads_search_idx ON forum_threads USING gin(to_tsvector('english', title || ' ' || body));

-- =====================================================
-- 6. THREAD TAGS (Many-to-Many)
-- =====================================================
CREATE TABLE IF NOT EXISTS forum_thread_tags (
    thread_id TEXT NOT NULL REFERENCES forum_threads(id) ON DELETE CASCADE,
    tag_id TEXT NOT NULL REFERENCES forum_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (thread_id, tag_id)
);

CREATE INDEX IF NOT EXISTS forum_thread_tags_tag_id_idx ON forum_thread_tags(tag_id);

-- =====================================================
-- 7. COMMENTS (Threaded Replies)
-- =====================================================
CREATE TABLE IF NOT EXISTS forum_comments (
    id TEXT PRIMARY KEY,
    thread_id TEXT NOT NULL REFERENCES forum_threads(id) ON DELETE CASCADE,
    parent_comment_id TEXT REFERENCES forum_comments(id) ON DELETE CASCADE,
    author_id TEXT NOT NULL,
    body TEXT NOT NULL,
    score INTEGER NOT NULL DEFAULT 0,
    is_hidden BOOLEAN NOT NULL DEFAULT false,
    is_accepted BOOLEAN NOT NULL DEFAULT false,
    moderation_status TEXT CHECK (moderation_status IN ('pending', 'approved', 'rejected')) DEFAULT 'approved',
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for comments
CREATE INDEX IF NOT EXISTS forum_comments_thread_id_idx ON forum_comments(thread_id);
CREATE INDEX IF NOT EXISTS forum_comments_parent_comment_id_idx ON forum_comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS forum_comments_author_id_idx ON forum_comments(author_id);
CREATE INDEX IF NOT EXISTS forum_comments_created_at_idx ON forum_comments(created_at);

-- =====================================================
-- 8. VOTES (Upvote/Downvote)
-- =====================================================
CREATE TABLE IF NOT EXISTS forum_votes (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    target_type TEXT CHECK (target_type IN ('thread', 'comment')) NOT NULL,
    target_id TEXT NOT NULL,
    value INTEGER CHECK (value IN (-1, 1)) NOT NULL,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, target_type, target_id)
);

-- Indexes for votes
CREATE INDEX IF NOT EXISTS forum_votes_user_id_idx ON forum_votes(user_id);
CREATE INDEX IF NOT EXISTS forum_votes_target_idx ON forum_votes(target_type, target_id);

-- =====================================================
-- 9. BOOKMARKS
-- =====================================================
CREATE TABLE IF NOT EXISTS forum_bookmarks (
    user_id TEXT NOT NULL,
    thread_id TEXT NOT NULL REFERENCES forum_threads(id) ON DELETE CASCADE,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, thread_id)
);

CREATE INDEX IF NOT EXISTS forum_bookmarks_thread_id_idx ON forum_bookmarks(thread_id);

-- =====================================================
-- 10. FOLLOWS (Thread Subscriptions)
-- =====================================================
CREATE TABLE IF NOT EXISTS forum_follows (
    user_id TEXT NOT NULL,
    thread_id TEXT NOT NULL REFERENCES forum_threads(id) ON DELETE CASCADE,
    notify_email BOOLEAN NOT NULL DEFAULT true,
    notify_in_app BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, thread_id)
);

CREATE INDEX IF NOT EXISTS forum_follows_thread_id_idx ON forum_follows(thread_id);

-- =====================================================
-- 11. REPORTS
-- =====================================================
CREATE TABLE IF NOT EXISTS forum_reports (
    id TEXT PRIMARY KEY,
    reporter_id TEXT NOT NULL,
    target_type TEXT CHECK (target_type IN ('thread', 'comment', 'user')) NOT NULL,
    target_id TEXT NOT NULL,
    reason TEXT NOT NULL,
    details TEXT,
    status TEXT CHECK (status IN ('open', 'reviewing', 'closed')) DEFAULT 'open',
    reviewed_by TEXT,
    reviewed_at TIMESTAMP(3),
    action_taken TEXT,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for reports
CREATE INDEX IF NOT EXISTS forum_reports_reporter_id_idx ON forum_reports(reporter_id);
CREATE INDEX IF NOT EXISTS forum_reports_target_idx ON forum_reports(target_type, target_id);
CREATE INDEX IF NOT EXISTS forum_reports_status_idx ON forum_reports(status);
CREATE INDEX IF NOT EXISTS forum_reports_created_at_idx ON forum_reports(created_at DESC);

-- =====================================================
-- 12. NOTIFICATIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS forum_notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL, -- 'new_comment', 'accepted_answer', 'mention', 'upvote'
    data JSONB NOT NULL,
    read_at TIMESTAMP(3),
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for notifications
CREATE INDEX IF NOT EXISTS forum_notifications_user_id_idx ON forum_notifications(user_id);
CREATE INDEX IF NOT EXISTS forum_notifications_created_at_idx ON forum_notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS forum_notifications_read_at_idx ON forum_notifications(read_at);

-- =====================================================
-- 13. BADGES
-- =====================================================
CREATE TABLE IF NOT EXISTS forum_badges (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    requirement_type TEXT NOT NULL, -- 'accepted_answers', 'reputation', 'posts_created'
    requirement_value INTEGER NOT NULL,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 14. USER BADGES (Many-to-Many)
-- =====================================================
CREATE TABLE IF NOT EXISTS forum_user_badges (
    user_id TEXT NOT NULL,
    badge_id TEXT NOT NULL REFERENCES forum_badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, badge_id)
);

CREATE INDEX IF NOT EXISTS forum_user_badges_badge_id_idx ON forum_user_badges(badge_id);

-- =====================================================
-- 15. RATE LIMITS
-- =====================================================
CREATE TABLE IF NOT EXISTS forum_rate_limits (
    user_id TEXT NOT NULL,
    action_type TEXT NOT NULL, -- 'create_thread', 'create_comment', 'create_vote'
    count INTEGER NOT NULL DEFAULT 1,
    window_start TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, action_type, window_start)
);

CREATE INDEX IF NOT EXISTS forum_rate_limits_window_start_idx ON forum_rate_limits(window_start);

-- =====================================================
-- 16. BLOCKED WORDS/URLs
-- =====================================================
CREATE TABLE IF NOT EXISTS forum_blocked_content (
    id TEXT PRIMARY KEY,
    pattern TEXT NOT NULL,
    type TEXT CHECK (type IN ('word', 'url', 'regex')) NOT NULL,
    severity TEXT CHECK (severity IN ('warning', 'block')) DEFAULT 'block',
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SEED DEFAULT TOPICS
-- =====================================================
INSERT INTO forum_topics (id, name, slug, description, icon, order_index) VALUES
('topic-ideas', 'Ideas de Negocio', 'ideas-negocio', 'Comparte y discute nuevas ideas de emprendimiento', '💡', 1),
('topic-marketing', 'Marketing', 'marketing', 'Estrategias de marketing y promoción', '📣', 2),
('topic-finance', 'Finanzas', 'finanzas', 'Gestión financiera y contabilidad', '💰', 3),
('topic-tech', 'Tecnología', 'tecnologia', 'Herramientas y soluciones tecnológicas', '💻', 4),
('topic-legal', 'Legal', 'legal', 'Aspectos legales y regulatorios', '⚖️', 5),
('topic-help', 'Ayuda', 'ayuda', 'Preguntas generales y solicitudes de ayuda', '❓', 6),
('topic-showcase', 'Proyectos', 'proyectos', 'Muestra tu proyecto y recibe feedback', '🚀', 7),
('topic-general', 'General', 'general', 'Discusiones generales sobre emprendimiento', '💬', 8)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- SEED DEFAULT BADGES
-- =====================================================
INSERT INTO forum_badges (id, name, description, icon, requirement_type, requirement_value) VALUES
('badge-helper', 'Ayudante', 'Recibió 5 respuestas aceptadas', '🌟', 'accepted_answers', 5),
('badge-mentor', 'Mentor', 'Recibió 20 respuestas aceptadas', '👨‍🏫', 'accepted_answers', 20),
('badge-expert', 'Experto', 'Alcanzó 100 puntos de reputación', '🏆', 'reputation', 100),
('badge-contributor', 'Colaborador', 'Creó 10 publicaciones', '✍️', 'posts_created', 10),
('badge-active', 'Activo', 'Creó 50 publicaciones', '🔥', 'posts_created', 50)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- SEED COMMON BLOCKED WORDS (Example)
-- =====================================================
INSERT INTO forum_blocked_content (id, pattern, type, severity) VALUES
('block-profanity-1', 'palabra_ofensiva', 'word', 'block'),
('block-social-instagram', 'instagram\\.com', 'url', 'warning'),
('block-social-facebook', 'facebook\\.com', 'url', 'warning'),
('block-email', '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', 'regex', 'warning'),
('block-phone', '\\d{3}[-.]?\\d{3}[-.]?\\d{4}', 'regex', 'warning')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- RLS POLICIES (Enable Row Level Security)
-- =====================================================
-- Note: RLS policies commented out for initial setup
-- Uncomment and configure auth.uid() once Supabase auth is set up

-- Enable RLS on all forum tables (run later)
-- ALTER TABLE forum_topics ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE forum_tags ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE forum_threads ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE forum_thread_tags ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE forum_comments ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE forum_votes ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE forum_bookmarks ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE forum_follows ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE forum_reports ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE forum_notifications ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE forum_badges ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE forum_user_badges ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- TRIGGERS & FUNCTIONS
-- =====================================================

-- Update thread comment count when comment is added/removed
CREATE OR REPLACE FUNCTION update_thread_comment_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE forum_threads 
        SET comment_count = comment_count + 1,
            updated_at = NOW()
        WHERE id = NEW.thread_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE forum_threads 
        SET comment_count = GREATEST(0, comment_count - 1),
            updated_at = NOW()
        WHERE id = OLD.thread_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_thread_comment_count
AFTER INSERT OR DELETE ON forum_comments
FOR EACH ROW EXECUTE FUNCTION update_thread_comment_count();

-- Update tag usage count
CREATE OR REPLACE FUNCTION update_tag_usage_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE forum_tags 
        SET usage_count = usage_count + 1
        WHERE id = NEW.tag_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE forum_tags 
        SET usage_count = GREATEST(0, usage_count - 1)
        WHERE id = OLD.tag_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_tag_usage_count
AFTER INSERT OR DELETE ON forum_thread_tags
FOR EACH ROW EXECUTE FUNCTION update_tag_usage_count();

-- =====================================================
-- DONE! 🎉
-- =====================================================

