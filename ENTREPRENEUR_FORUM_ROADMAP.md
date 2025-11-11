# 🚀 BIZEN Entrepreneur Forum - Implementation Roadmap

## ✅ Phase 1: Database & Schema (DONE)

- [x] Created comprehensive SQL schema with RLS policies
- [x] Updated Prisma schema with all models
- [x] Added forum-specific fields to Profile model
- [x] Created 14 new database tables
- [x] Set up indexes and constraints
- [x] Added database triggers for counters

### Database Tables Created:
1. ✅ forum_topics (8 topics seeded)
2. ✅ forum_tags
3. ✅ forum_threads
4. ✅ forum_thread_tags
5. ✅ forum_comments (threaded)
6. ✅ forum_votes (upvote/downvote)
7. ✅ forum_bookmarks
8. ✅ forum_follows (subscriptions)
9. ✅ forum_reports
10. ✅ forum_notifications
11. ✅ forum_badges (5 badges seeded)
12. ✅ forum_user_badges
13. ✅ forum_rate_limits
14. ✅ forum_blocked_content

---

## 🎯 Phase 2: Core Pages (IN PROGRESS)

###  Pages to Build:
- [ ] `/forum` - Main feed (new, top, unanswered)
- [ ] `/forum/topic/[slug]` - Topic feed
- [ ] `/forum/tag/[slug]` - Tag feed
- [ ] `/forum/thread/[id]` - Thread detail with comments
- [ ] `/forum/new` - Create thread
- [ ] `/forum/search` - Search UI
- [ ] `/profile/[userId]` - Public profile
- [ ] `/account/settings` - Nickname & preferences
- [ ] `/moderation` - Moderation queue
- [ ] `/leaderboard` - Weekly leaderboard

---

## 🔌 Phase 3: API Routes (NEXT)

### Thread APIs:
- [ ] `POST /api/forum/threads` - Create thread
- [ ] `GET /api/forum/threads` - List threads
- [ ] `GET /api/forum/threads/[id]` - Get thread
- [ ] `PATCH /api/forum/threads/[id]` - Update thread
- [ ] `DELETE /api/forum/threads/[id]` - Delete thread

### Comment APIs:
- [ ] `POST /api/forum/comments` - Create comment
- [ ] `PATCH /api/forum/comments/[id]` - Update comment
- [ ] `DELETE /api/forum/comments/[id]` - Delete comment

### Vote APIs:
- [ ] `POST /api/forum/votes` - Upvote/downvote
- [ ] `DELETE /api/forum/votes` - Remove vote

### Engagement APIs:
- [ ] `POST /api/forum/follows` - Follow thread
- [ ] `DELETE /api/forum/follows` - Unfollow thread
- [ ] `POST /api/forum/bookmarks` - Bookmark thread
- [ ] `DELETE /api/forum/bookmarks` - Remove bookmark
- [ ] `POST /api/forum/accepted` - Mark accepted answer

### Moderation APIs:
- [ ] `POST /api/forum/reports` - Create report
- [ ] `GET /api/forum/moderation` - Get moderation queue
- [ ] `PATCH /api/forum/moderation/[id]` - Take moderation action

### Other APIs:
- [ ] `GET /api/forum/search` - Search threads
- [ ] `GET /api/notifications` - Get notifications
- [ ] `PATCH /api/notifications/[id]` - Mark read
- [ ] `GET /api/profile/me` - Get profile
- [ ] `PATCH /api/profile/me` - Update profile

---

## 🛡️ Phase 4: Security & Safety

### Content Filtering:
- [ ] Word filter utility (profanity, PII)
- [ ] URL filter (social media links)
- [ ] Regex filter (emails, phones)
- [ ] Sanitize Markdown output

### Rate Limiting:
- [ ] Limit threads per hour
- [ ] Limit comments per hour
- [ ] Limit votes per hour
- [ ] Track in `forum_rate_limits` table

### Reputation Gates:
- [ ] Block external links for reputation < 20
- [ ] Pre-moderation for first 3 posts
- [ ] Auto-hide content with 3+ reports

### Privacy for Minors:
- [ ] Default to nickname (never email/name)
- [ ] No DMs for students
- [ ] Block personal data sharing

---

## 🔔 Phase 5: Notifications

### In-App Notifications:
- [ ] New comment on my thread
- [ ] My answer accepted
- [ ] @mention
- [ ] Upvote received

### Email Notifications (Resend):
- [ ] Daily digest for followed threads
- [ ] Weekly digest option
- [ ] Email templates
- [ ] Unsubscribe handling

---

## 🎮 Phase 6: Gamification

### XP System:
- [ ] +10 XP for accepted answer
- [ ] +2 XP for upvote received
- [ ] +1 XP for first post
- [ ] Update reputation automatically

### Badges:
- [ ] Auto-award badges based on achievements
- [ ] Badge display on profile
- [ ] Badge icons in threads/comments

### Leaderboard:
- [ ] Weekly top contributors by school
- [ ] Display on `/leaderboard`
- [ ] Filter by school_id

---

## 🎨 Phase 7: UI/UX Polish

### Components (shadcn/ui):
- [ ] Thread card component
- [ ] Comment component (threaded)
- [ ] Vote buttons component
- [ ] Tag badges component
- [ ] Status chips (open/resolved/locked)
- [ ] Markdown editor with preview
- [ ] Report dialog
- [ ] Bookmark button
- [ ] Follow button

### Features:
- [ ] Accept answer button (thread author only)
- [ ] Edit/delete own posts
- [ ] Thread status indicators
- [ ] Accepted answer at top
- [ ] Threaded comment display
- [ ] Vote count display
- [ ] Tag filtering
- [ ] Topic filtering

---

## 📝 Phase 8: Editor & Markdown

### Markdown Support:
- [ ] Text formatting (bold, italic, code)
- [ ] Lists and quotes
- [ ] Code blocks with syntax highlighting
- [ ] Auto-link URLs (with reputation check)
- [ ] Preview mode
- [ ] **NO image button**
- [ ] **NO file uploads**

### Sanitization:
- [ ] Remove HTML tags
- [ ] Escape dangerous content
- [ ] Block script injection

---

## 🧪 Phase 9: Testing & Validation

### API Validation (Zod):
- [ ] Thread creation schema
- [ ] Comment creation schema
- [ ] Vote schema
- [ ] Report schema
- [ ] Profile update schema

### Testing:
- [ ] Test RLS policies
- [ ] Test rate limiting
- [ ] Test content filters
- [ ] Test vote system
- [ ] Test accepted answers
- [ ] Test notifications

---

## 📊 Current Progress

```
Phase 1: ████████████████████ 100% DONE
Phase 2: ░░░░░░░░░░░░░░░░░░░░   0% IN PROGRESS
Phase 3: ░░░░░░░░░░░░░░░░░░░░   0% NEXT
Phase 4: ░░░░░░░░░░░░░░░░░░░░   0%
Phase 5: ░░░░░░░░░░░░░░░░░░░░   0%
Phase 6: ░░░░░░░░░░░░░░░░░░░░   0%
Phase 7: ░░░░░░░░░░░░░░░░░░░░   0%
Phase 8: ░░░░░░░░░░░░░░░░░░░░   0%
Phase 9: ░░░░░░░░░░░░░░░░░░░░   0%

Overall: ███░░░░░░░░░░░░░░░░░  11%
```

---

## 🎯 MVP Acceptance Criteria

- [ ] User can create a text-only thread with title/body/tags/topic
- [ ] Threads appear in `/forum` feed
- [ ] User can open a thread and see all comments
- [ ] User can comment on threads (threaded replies)
- [ ] User can upvote/downvote threads and comments
- [ ] Thread author can mark one answer as accepted
- [ ] User can search by text and filter by topic/tag
- [ ] User can subscribe to threads (in-app + email)
- [ ] User can bookmark threads
- [ ] User can report content
- [ ] Reports appear in `/moderation` queue
- [ ] Moderator can act on reports
- [ ] RLS blocks cross-user edits
- [ ] Nickname shows instead of real name
- [ ] External links restricted for low reputation
- [ ] NO image or file uploads anywhere

---

## 📦 Deliverables

1. ✅ SQL migrations (tables, indexes, RLS policies)
2. ✅ Prisma schema
3. ⏳ Next.js pages with Tailwind + shadcn/ui
4. ⏳ Route handlers with Zod validation
5. ⏳ React Query hooks
6. ⏳ Word/URL filter utils
7. ⏳ Rate limiter
8. ⏳ Email templates (Resend)

---

## 🚦 Next Steps

**IMMEDIATE:** Build core forum pages starting with `/forum` main feed

**THEN:** Build thread detail page with comments

**AFTER:** Create thread form and API routes

Let's go! 🚀

