import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const upstashUrl = Deno.env.get('UPSTASH_REDIS_REST_URL')!
const upstashToken = Deno.env.get('UPSTASH_REDIS_REST_TOKEN')!

// Service role key, not anon key — this function acts across every
// user's data, so it must bypass the RLS policies from Phase 2 that
// were written for individual logged-in users.
const supabase = createClient(supabaseUrl, serviceRoleKey)

function getTodayDateString(): string {
    return new Date().toISOString().split('T')[0]
}

function isConsecutiveDay(previousDate: string, currentDate: string): boolean {
    const diffMs = new Date(currentDate).getTime() - new Date(previousDate).getTime()
    return Math.round(diffMs / (1000 * 60 * 60 * 24)) === 1
}

// Same algorithm as src/utils/streakCalculator.js (Phase 7), duplicated
// here on purpose — Deno Edge Functions run in an isolated runtime and
// can't import directly from the React app's src/ folder. If the streak
// rules ever change, update both copies together.
function calculateStreaks(completionDates: string[]) {
    if (!completionDates || completionDates.length === 0) {
        return { currentStreak: 0, longestStreak: 0 }
    }

    const sortedDates = [...completionDates].sort()
    let longestStreak = 1
    let runningStreak = 1

    for (let i = 1; i < sortedDates.length; i++) {
        runningStreak = isConsecutiveDay(sortedDates[i - 1], sortedDates[i])
            ? runningStreak + 1
            : 1
        longestStreak = Math.max(longestStreak, runningStreak)
    }

    const mostRecent = sortedDates[sortedDates.length - 1]
    const today = getTodayDateString()
    const daysSinceLast = Math.round(
        (new Date(today).getTime() - new Date(mostRecent).getTime()) / (1000 * 60 * 60 * 24)
    )

    const currentStreak = daysSinceLast <= 1 ? runningStreak : 0
    return { currentStreak, longestStreak }
}

// Minimal Upstash REST helpers — no @upstash/redis SDK here, since Deno
// Edge Functions talk to it over plain fetch just as easily.
async function redisHGetAll(key: string): Promise<Record<string, string>> {
    const response = await fetch(`${upstashUrl}/hgetall/${key}`, {
        headers: { Authorization: `Bearer ${upstashToken}` },
    })
    const { result } = await response.json()
    const map: Record<string, string> = {}
    // Upstash returns null (not []) when the key doesn't exist — guard
    // against that so the cron doesn't crash for users with no completions.
    if (!result) return map
    for (let i = 0; i < result.length; i += 2) {
        map[result[i]] = result[i + 1]
    }
    return map
}

async function redisSet(key: string, value: string, ttlSeconds: number) {
    await fetch(`${upstashUrl}/set/${key}/${value}?EX=${ttlSeconds}`, {
        headers: { Authorization: `Bearer ${upstashToken}` },
    })
}

Deno.serve(async () => {
    const today = getTodayDateString()

    const { data: habits, error: habitsError } = await supabase
        .from('habits')
        .select('id, user_id')
        .eq('is_active', true)

    if (habitsError) {
        return new Response(JSON.stringify({ error: habitsError.message }), { status: 500 })
    }

    const completionsByUser = new Map<string, Record<string, string>>()
    let processedCount = 0

    for (const habit of habits) {
        if (!completionsByUser.has(habit.user_id)) {
            const completions = await redisHGetAll(`completions:${habit.user_id}:${today}`)
            completionsByUser.set(habit.user_id, completions)
        }

        const todaysCompletions = completionsByUser.get(habit.user_id)!
        const wasCompletedToday = Boolean(todaysCompletions[habit.id])

        if (wasCompletedToday) {
            // Upsert, not insert — protects against this function accidentally
            // running twice for the same day and hitting the unique constraint
            // on (habit_id, completed_date) from Phase 2's schema.
            await supabase.from('habit_completions').upsert(
                { habit_id: habit.id, user_id: habit.user_id, completed_date: today },
                { onConflict: 'habit_id,completed_date' }
            )
        }

        // Recalculate from full history either way — a missed day naturally
        // resets currentStreak to 0 without any special-case branching.
        const { data: historyRows } = await supabase
            .from('habit_completions')
            .select('completed_date')
            .eq('habit_id', habit.id)

        const completionDates = (historyRows || []).map((row) => row.completed_date)
        const { currentStreak, longestStreak } = calculateStreaks(completionDates)

        await supabase.from('streaks').upsert(
            {
                habit_id: habit.id,
                user_id: habit.user_id,
                current_streak: currentStreak,
                longest_streak: longestStreak,
                // Only overwrite last_completed_date when there's a real new
                // completion — omitting it on a missed day preserves the
                // previous date rather than falsely nulling it out.
                ...(wasCompletedToday && { last_completed_date: today }),
                updated_at: new Date().toISOString(),
            },
            { onConflict: 'habit_id' }
        )

        // Refresh the Redis streak cache immediately, so Phase 6's
        // useStreakData hook shows the new number right away instead of
        // serving a stale cached value for up to an hour.
        await redisSet(`streak:${habit.id}`, String(currentStreak), 60 * 60)

        processedCount += 1
    }

    return new Response(
        JSON.stringify({ processed: processedCount, date: today }),
        { headers: { 'Content-Type': 'application/json' } }
    )
})