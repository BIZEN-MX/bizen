-- =====================================================================
-- BIZEN NOTIFICATIONS PROTECTION - RLS POLICIES
-- Execute this script in the Supabase SQL Editor (SQL Editor)
-- This script ensures each user can only read/write their own notifications.
-- =====================================================================

-- 1. Enable RLS on both tables
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_notifications ENABLE ROW LEVEL SECURITY;

-- 2. POLICIES FOR 'notifications' (System)
-- Note: 'user_id' in this table is a UUID referencing auth.users

-- Allow users to see their own notifications
DROP POLICY IF EXISTS "Users can only select their own notifications" ON public.notifications;
CREATE POLICY "Users can only select their own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

-- Allow users to mark their own notifications as read (UPDATE)
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- 3. POLICIES FOR 'forum_notifications'
-- Note: 'user_id' in this table is a String (CUID/Text) referencing profiles.user_id

-- Allow users to see their own forum notifications
-- (We cast auth.uid() to text to match the column type)
DROP POLICY IF EXISTS "Users can select their own forum notifications" ON public.forum_notifications;
CREATE POLICY "Users can select their own forum notifications" ON public.forum_notifications
    FOR SELECT USING (auth.uid()::text = user_id);

-- Allow users to mark their own forum notifications as read
DROP POLICY IF EXISTS "Users can update their own forum notifications" ON public.forum_notifications;
CREATE POLICY "Users can update their own forum notifications" ON public.forum_notifications
    FOR UPDATE USING (auth.uid()::text = user_id);

-- 4. SERVER-SIDE PERMISSION (Optional)
-- This ensures the service_role key can always bypass RLS for background triggers.
-- (Supabase does this by default, but it's good to keep in mind)

COMMIT;
