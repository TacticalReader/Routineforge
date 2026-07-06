# RoutineForge

A habit tracker built to learn Redis (sorted sets, hashes, TTL, rate
limiting) and cron jobs from scratch.

## Stack
- React.js (Vite)
- Supabase (Postgres, Auth, Edge Functions, pg_cron)
- Upstash Redis (via REST API)
- Deployed on Vercel

## Local Setup
1. Clone the repo
2. Run `npm install`
3. Copy `.env.example` to `.env` and fill in Supabase + Upstash credentials
4. Run `npm run dev`

https://github.com/TacticalReader/Routineforge

## Project Structure

```text
routineforge/
├── public/
│   ├── favicon.svg
│   └── manifest.json
│
├── src/
│   ├── assets/
│   │   └── icons/
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── AppButton.jsx
│   │   │   ├── AppModal.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── habits/
│   │   │   ├── HabitCard.jsx
│   │   │   ├── HabitForm.jsx
│   │   │   ├── HabitCompletionToggle.jsx
│   │   │   └── StreakBadge.jsx
│   │   └── layout/
│   │       ├── AppHeader.jsx
│   │       ├── AppSidebar.jsx
│   │       └── AppFooter.jsx
│   │
│   ├── pages/
│   │   ├── DashboardPage.jsx
│   │   ├── HabitDetailPage.jsx
│   │   ├── AuthPage.jsx
│   │   └── SettingsPage.jsx
│   │
│   ├── hooks/
│   │   ├── useHabits.js
│   │   ├── useStreakData.js
│   │   └── useAuthSession.js
│   │
│   ├── services/
│   │   ├── supabaseClient.js
│   │   ├── habitService.js
│   │   ├── redisCacheService.js
│   │   └── notificationService.js
│   │
│   ├── context/
│   │   └── SessionProvider.jsx
│   │
│   ├── routes/
│   │   └── AppRoutes.jsx
│   │
│   ├── utils/
│   │   ├── dateHelpers.js
│   │   └── streakCalculator.js
│   │
│   ├── styles/
│   │   └── global.css
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── supabase/
│   ├── functions/
│   │   ├── nightly-streak-processor/
│   │   │   └── index.ts
│   │   └── morning-reminder-dispatch/
│   │       └── index.ts
│   ├── migrations/
│   │   └── 0001_init_schema.sql
│   └── config.toml
│
├── notes/
│   └── project-log.txt
│
├── .env.example
├── package.json
├── vite.config.js
├── vercel.json
└── README.md
```