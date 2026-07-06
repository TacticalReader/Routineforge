# 🔥 RoutineForge

A habit tracker built from scratch to actually **learn Redis and cron
jobs** — not just read about them. Every architectural decision in this
repo exists to make that learning concrete: Redis handles the one
interaction that happens constantly (marking a habit done), and a nightly
cron job is what turns that ephemeral state into permanent streak history.

🔗 **Repo:** [github.com/TacticalReader/Routineforge](https://github.com/TacticalReader/Routineforge)

---

## ✨ Features

- ✅ Create, complete, and track daily habits
- 🔥 Automatic streak tracking (current + longest)
- ⚡ Instant habit-completion toggling, backed by Redis — not a database write on every tap
- ⏰ Nightly cron job that finalizes the day and updates streaks
- 📬 Morning reminder emails for habits with a streak worth protecting
- 🔐 Full auth flow with protected routes
- 🎨 Flat, high-contrast UI with no light/dark toggle — one deliberate theme

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| 🖥️ Frontend | React.js (Vite) + React Router |
| 🗄️ Database & Auth | Supabase (Postgres + Auth) |
| ⚡ Caching / Queue | Upstash Redis (REST API) |
| ⏱️ Scheduled Jobs | Supabase Edge Functions + `pg_cron` |
| 📧 Email | Resend |
| 🎨 Icons | lucide-react |
| ☁️ Hosting | Vercel |

---

## 🧠 How Redis & Cron Fit In

This is the part of the project that actually matters, so it's worth
spelling out:

1. **Today's completions live in Redis**, not Postgres — stored as a hash
   (`completions:<userId>:<date>`) with a 48-hour TTL. Toggling a habit is
   a sub-millisecond Redis write instead of a database round-trip.
2. **Streak counts are cached in Redis too** (`streak:<habitId>`), using a
   cache-aside pattern: read the cache first, fall back to Postgres on a
   miss, then repopulate the cache.
3. **A nightly cron job** (`nightly-streak-processor`, running at 11:59 PM
   via `pg_cron`) reads each user's Redis completions, writes the
   permanent record into `habit_completions`, recalculates streaks, and
   refreshes the Redis cache — closing the loop between "ephemeral" and
   "permanent" state.
4. **A morning cron job** (`morning-reminder-dispatch`, running at 8 AM)
   emails users who have an active streak worth protecting.

---

## 📁 Project Structure

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

---

## 🔑 Environment Variables

Copy `.env.example` to `.env` and fill in:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_UPSTASH_REDIS_REST_URL=
VITE_UPSTASH_REDIS_REST_TOKEN=
```

The Edge Functions in `supabase/functions/` need their own secrets, set
separately via the Supabase CLI (never committed to `.env`):

```bash
supabase secrets set SUPABASE_URL=https://<project-ref>.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
supabase secrets set UPSTASH_REDIS_REST_URL=<your-upstash-url>
supabase secrets set UPSTASH_REDIS_REST_TOKEN=<your-upstash-token>
supabase secrets set RESEND_API_KEY=<your-resend-key>
```

---

## 🚀 Local Setup

```bash
git clone https://github.com/TacticalReader/Routineforge.git
cd Routineforge
npm install
cp .env.example .env   # then fill in your credentials
npm run dev
```

The app runs at `http://localhost:5173`.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the local dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

---

## ☁️ Deployment

**Frontend (Vercel):**
1. Push to GitHub
2. Import the repo in Vercel
3. Add the four `VITE_*` environment variables in the Vercel dashboard
4. Deploy — `vercel.json` handles client-side routing rewrites automatically

**Backend (Supabase):**
```bash
supabase link --project-ref <your-project-ref>
supabase db push
supabase functions deploy nightly-streak-processor
supabase functions deploy morning-reminder-dispatch
```

**Cron schedules** are registered via `pg_cron` + `pg_net`, with the
service role key stored in Supabase Vault rather than hardcoded into the
schedule SQL. See `notes/project-log.txt` for the exact statements used.

---

## ⏱️ Cron Jobs

| Job | Schedule | Purpose |
|---|---|---|
| `nightly-streak-processor` | `59 23 * * *` (11:59 PM) | Flushes Redis completions → Postgres, recalculates streaks |
| `morning-reminder-dispatch` | `0 8 * * *` (8:00 AM) | Emails users with an active streak worth protecting |

Check job health anytime with:
```sql
select * from cron.job_run_details order by start_time desc limit 10;
```

---


## 📄 License

MIT
