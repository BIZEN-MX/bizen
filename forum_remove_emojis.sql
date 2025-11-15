-- Remove emojis from ALL forum topics
-- This will remove emojis from any existing topics in the database

-- First, let's see what topics currently have icons/emojis
SELECT "id", "name", "icon" FROM "forum_topics" WHERE "icon" IS NOT NULL;

-- Remove emojis from all topics
UPDATE "forum_topics" 
SET "icon" = NULL 
WHERE "icon" IS NOT NULL;

-- Verify: Check that all icons are now NULL
SELECT "id", "name", "icon" FROM "forum_topics";

