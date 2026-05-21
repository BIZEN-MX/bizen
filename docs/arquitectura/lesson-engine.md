# Lesson Engine Architecture: BIZEN

## Overview
The Lesson Engine is the core educational component of BIZEN. It manages how content is structured, delivered, and how student progress is tracked and rewarded.

## Content Hierarchy
The curriculum follows a strict 5-level hierarchy:
1. **Topic:** The high-level subject (e.g., "Ahorro e Inversión").
2. **Course:** A specific module within a topic (e.g., "Introducción al Ahorro").
3. **Section:** A grouping of related lessons within a course.
4. **Lesson:** The atomic unit of learning (e.g., "¿Qué es una tasa de interés?").
5. **LessonStep:** Individual screens or interactive components within a lesson.

## Progress Tracking
- **Model `Progress`:** Tracks the percentage of completion for each user per lesson.
- **Completion Criteria:** A lesson is considered "Completed" when `percent` reaches 100.
- **Idempotency:** XP and rewards are only granted the first time a lesson reaches 100% completion to prevent exploits.

## API Flow
1. **Fetching Progress:** `GET /api/progress?lessonId=XYZ`
2. **Updating Progress:** `POST /api/progress`
   - Payload: `{ lessonId, percent, completedAt }`
   - Response: Updated progress object + any earned XP/Achievements.

## Reward Logic
When a lesson is completed (`percent === 100` and was previously `< 100`):
- **XP Reward:** 50 XP (standard).
- **Bizcoins:** Granting Bizcoins is optional and depends on the specific lesson configuration.
- **Achievements Check:** The system automatically checks if the user has triggered any milestones (e.g., "5 lessons completed").

## Integration with Gamification
The `POST /api/progress` route calls:
- `awardXp(userId, 50)` from `@/lib/rewards`.
- `checkAndAwardAchievements(userId, stats)` from `@/lib/achievements`.
