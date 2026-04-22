# Gamification System: BIZEN

## Overview
The gamification system is designed to drive engagement and retention by rewarding students for their learning progress and consistency.

## Core Components

### 1. XP (Experience Points) & Levels
- **XP:** A cumulative score that reflects a user's total effort on the platform.
- **Levels:** Calculated from total XP using a progressive gap formula.
  - Level 1: 0 XP
  - Level 2: 100 XP
  - Level 3: 250 XP (+150)
  - Level 4: 450 XP (+200)
- **Implementation:** `src/lib/xp.ts` contains the logic for `calculateLevel`, `xpForLevel`, etc.

### 2. Bizcoins
- The virtual currency of BIZEN.
- Users can earn Bizcoins through specific achievements and spend them in the Store (`/tienda`).
- Stored in the `Profile.bizcoins` field in the database.

### 3. Streaks (Rachas)
- Tracks consecutive days of activity.
- **Persistence:** Calculated based on Mexico City time (`America/Mexico_City`) to avoid UTC rollover issues at 6:00 PM local time.
- **Logic:** If `diffDays > 1` from the last active date, the streak resets to 0.

### 4. Achievements (Logros)
- Defined in the `UserAchievement` model.
- Triggered by specific events (e.g., completing 5 lessons, reaching level 10).

## Reward Table (Standard)
| Activity | XP Reward |
| :--- | :--- |
| Lesson Complete | 50 XP |
| Quiz Pass | 100 XP |
| Quiz Perfect | 150 XP |
| Daily Streak | 25 XP |
| Course Complete | 500 XP |

## Database Schema
- **Model `Profile`:** Stores `xp`, `level`, `bizcoins`, `currentStreak`, `longestStreak`.
- **Model `UserAchievement`:** Stores records of earned achievements.
- **Model `UserInventoryItem`:** Stores items purchased with Bizcoins.
