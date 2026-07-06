import { isConsecutiveDay } from './dateHelpers'

/**
 * Computes current and longest streak from a list of completion dates
 * ('YYYY-MM-DD' strings, any order — this function sorts them itself).
 *
 * Framework-agnostic on purpose: no React, no Supabase, no browser APIs.
 * This lets the identical function run inside the Phase 8 Edge Function
 * (Deno) as well as in the React app, so the streak math is defined once.
 */
export function calculateStreaks(completionDates) {
    if (!completionDates || completionDates.length === 0) {
        return { currentStreak: 0, longestStreak: 0 }
    }

    const sortedDates = [...completionDates].sort()

    let longestStreak = 1
    let runningStreak = 1

    for (let i = 1; i < sortedDates.length; i++) {
        if (isConsecutiveDay(sortedDates[i - 1], sortedDates[i])) {
            runningStreak += 1
        } else {
            runningStreak = 1
        }
        longestStreak = Math.max(longestStreak, runningStreak)
    }

    // The current streak only counts if the most recent completion was
    // today or yesterday. If it's older than that, the streak is broken —
    // even though `runningStreak` might still hold a large number from
    // the loop above.
    const mostRecentDate = sortedDates[sortedDates.length - 1]
    const todayString = new Date().toISOString().split('T')[0]
    const daysSinceLastCompletion = daysBetween(mostRecentDate, todayString)

    const currentStreak = daysSinceLastCompletion <= 1 ? runningStreak : 0

    return { currentStreak, longestStreak }
}

function daysBetween(earlierDateString, laterDateString) {
    const earlier = new Date(earlierDateString)
    const later = new Date(laterDateString)
    return Math.round((later.getTime() - earlier.getTime()) / (1000 * 60 * 60 * 24))
}