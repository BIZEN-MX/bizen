# BIZEN: Software Architecture Guide

## 1. Overview
BIZEN is a gamified financial education platform designed for high school students. It uses a modern web stack to deliver a high-performance experience across web and mobile (via Capacitor).

## 2. Tech Stack
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL (Hosted on Cloud SQL / Supabase)
- **ORM:** Prisma
- **Auth:** Clerk (Authentication & User Management)
- **Styling:** Tailwind CSS + Vanilla CSS (Premium Aesthetics)
- **Mobile:** Capacitor (iOS/Android)
- **Communications:** Resend (Email), Stripe (Payments)

## 3. Directory Structure
```
/
├── prisma/               # Database schema and migrations
├── src/
│   ├── app/              # Next.js App Router (Routes, Layouts, API)
│   ├── components/       # Reusable UI components
│   ├── lib/              # Shared logic, utilities, and DB clients
│   ├── types/            # TypeScript interfaces/types
│   ├── hooks/            # Custom React hooks
│   └── data/             # Static content or initial seeds
├── android/              # Capacitor Android project
├── ios/                  # Capacitor iOS project
└── _agents/              # AI Agent workflows and instructions
```

## 4. Core Systems

### A. Curriculum & Lesson Engine
- **Models:** `Topic` -> `Course` -> `Section` -> `Lesson` -> `LessonStep`.
- **Logic:** Progress is tracked in the `Progress` and `StepResponse` models.
- **Workflow:** Defined in `_agents/workflows/bizen-lesson-blueprint.md`.

### B. Gamification (The "Bizen Economy")
- **XP & Levels:** Tracked in `Profile`. Earned through lessons and challenges.
- **Bizcoins:** Virtual currency stored in `Profile.bizcoins`.
- **Streaks:** Daily activity tracking via `Profile.currentStreak`.
- **Inventory:** Items purchased in the store (`UserInventoryItem`).

### C. Cashflow Simulator
- Models for `GameSession`, `Player`, `OpportunityCard`, etc.
- Logic resides primarily in `src/lib/cashflow/` and specific API routes.

## 5. Development Principles
1. **Type Safety:** Always define types for API responses and component props.
2. **Component Isolation:** UI components should be pure and reusable when possible.
3. **Server vs. Client:** Use Server Components by default for better performance and SEO.
4. **Database Access:** Always use the centralized Prisma client in `src/lib/prisma.ts`.

## 6. Deployment & Environment
- **Platform:** Vercel (Frontend/API)
- **Database:** Cloud SQL (Production) / Supabase (Development/Staging)
- **CI/CD:** GitHub Actions / Vercel Integration
