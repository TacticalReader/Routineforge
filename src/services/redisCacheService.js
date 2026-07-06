import { Redis } from '@upstash/redis'

const redis = new Redis({
    url: import.meta.env.VITE_UPSTASH_REDIS_REST_URL,
    token: import.meta.env.VITE_UPSTASH_REDIS_REST_TOKEN,
})

// Key pattern: completions:<userId>:<YYYY-MM-DD>
// Value: a hash of { [habitId]: 'true' } for every habit completed that day
function getCompletionKey(userId, dateString) {
    return `completions:${userId}:${dateString}`
}

export async function markHabitComplete(userId, habitId, dateString) {
    const key = getCompletionKey(userId, dateString)
    await redis.hset(key, { [habitId]: 'true' })

    // Expire 48 hours after the day begins — gives the nightly cron
    // (Phase 8) a safety window to read this before it disappears,
    // instead of expiring at exactly midnight.
    await redis.expire(key, 60 * 60 * 48)
}

export async function unmarkHabitComplete(userId, habitId, dateString) {
    const key = getCompletionKey(userId, dateString)
    await redis.hdel(key, habitId)
}

export async function getTodayCompletions(userId, dateString) {
    const key = getCompletionKey(userId, dateString)
    const data = await redis.hgetall(key)
    return data || {}
}

// Streak cache: key = streak:<habitId>, value = current streak count.
// This is a classic cache-aside pattern — Postgres is the source of
// truth (Phase 2's `streaks` table), Redis just avoids hitting it on
// every render.
export async function getCurrentStreakCache(habitId) {
    const key = `streak:${habitId}`
    const value = await redis.get(key)
    return value !== null && value !== undefined ? Number(value) : null
}

export async function setCurrentStreakCache(habitId, streakCount) {
    const key = `streak:${habitId}`
    // 1 hour TTL — cheap to recompute from Postgres on a miss, so the
    // cache doesn't need to be perfectly fresh.
    await redis.set(key, streakCount, { ex: 60 * 60 })
}