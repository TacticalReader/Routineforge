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
└── README.md