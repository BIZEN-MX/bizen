-- ===================================================================
-- CONTACT MESSAGES TABLE SETUP FOR BIZEN
-- ===================================================================
-- Run this SQL in your Supabase Dashboard → SQL Editor
-- This creates the table to store contact form messages
-- ===================================================================

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE,
  responded BOOLEAN DEFAULT FALSE
);

-- Create index for faster queries by email
CREATE INDEX IF NOT EXISTS contact_messages_email_idx ON contact_messages(email);

-- Create index for faster queries by created_at (for sorting)
CREATE INDEX IF NOT EXISTS contact_messages_created_at_idx ON contact_messages(created_at DESC);

-- Create index for filtering unread messages
CREATE INDEX IF NOT EXISTS contact_messages_read_idx ON contact_messages(read) WHERE read = FALSE;

-- Enable Row Level Security (RLS)
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to INSERT (submit contact form)
CREATE POLICY "Allow public to insert contact messages"
ON contact_messages
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Policy: Allow authenticated admin users to SELECT all messages
-- Note: You'll need to configure admin access based on your auth setup
CREATE POLICY "Allow admins to read contact messages"
ON contact_messages
FOR SELECT
TO authenticated
USING (
  -- Add your admin check logic here
  -- For example, if you have a role in user metadata:
  -- (auth.jwt() ->> 'user_role')::text = 'admin'
  -- For now, this allows all authenticated users to read
  true
);

-- Policy: Allow authenticated admin users to UPDATE (mark as read/responded)
CREATE POLICY "Allow admins to update contact messages"
ON contact_messages
FOR UPDATE
TO authenticated
USING (
  -- Same admin check as above
  true
)
WITH CHECK (
  -- Same admin check as above
  true
);

-- Add comments for documentation
COMMENT ON TABLE contact_messages IS 'Stores contact form messages from users';
COMMENT ON COLUMN contact_messages.id IS 'Unique identifier for each message';
COMMENT ON COLUMN contact_messages.name IS 'Name of the person submitting the form';
COMMENT ON COLUMN contact_messages.email IS 'Email of the person submitting the form';
COMMENT ON COLUMN contact_messages.message IS 'The message content from the contact form';
COMMENT ON COLUMN contact_messages.created_at IS 'Timestamp when the message was created';
COMMENT ON COLUMN contact_messages.read IS 'Whether the message has been read by admin';
COMMENT ON COLUMN contact_messages.responded IS 'Whether the message has been responded to';

