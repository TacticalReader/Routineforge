-- Habits: the core entity a user creates and tracks
create table habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Habit completions: the permanent, source-of-truth record of each day
-- a habit was marked done. Redis (Phase 6) holds *today's* state
-- temporarily; this table is what the nightly cron (Phase 8) writes to.
create table habit_completions (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references habits(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  completed_date date not null,
  created_at timestamptz not null default now(),
  unique (habit_id, completed_date)
);

-- Streaks: one row per habit, updated by the nightly cron job.
-- Kept separate from habit_completions so streak reads are O(1)
-- instead of recalculating from history on every page load.
create table streaks (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null unique references habits(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_completed_date date,
  updated_at timestamptz not null default now()
);

-- Indexes for the lookups the app will do most often
create index idx_habits_user_id on habits(user_id);
create index idx_completions_habit_id on habit_completions(habit_id);
create index idx_completions_user_date on habit_completions(user_id, completed_date);
create index idx_streaks_user_id on streaks(user_id);

-- Row Level Security: users can only ever see/modify their own data
alter table habits enable row level security;
alter table habit_completions enable row level security;
alter table streaks enable row level security;

create policy "Users can manage their own habits"
  on habits for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can manage their own completions"
  on habit_completions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can view and update their own streaks"
  on streaks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);