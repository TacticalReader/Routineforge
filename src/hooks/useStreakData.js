import { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'
import {
    getCurrentStreakCache,
    setCurrentStreakCache,
} from '../services/redisCacheService'

export function useStreakData(habitId) {
    const [streak, setStreak] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        let isMounted = true

        async function loadStreak() {
            setIsLoading(true)

            // 1. Try Redis first
            const cached = await getCurrentStreakCache(habitId)
            if (cached !== null) {
                if (isMounted) {
                    setStreak(cached)
                    setIsLoading(false)
                }
                return
            }

            // 2. Cache miss — fall back to Postgres (the source of truth)
            const { data, error } = await supabase
                .from('streaks')
                .select('current_streak')
                .eq('habit_id', habitId)
                .maybeSingle()

            if (!error && data && isMounted) {
                setStreak(data.current_streak)
                // 3. Repopulate the cache so the next read is fast
                await setCurrentStreakCache(habitId, data.current_streak)
            }

            if (isMounted) setIsLoading(false)
        }

        loadStreak()
        return () => {
            isMounted = false
        }
    }, [habitId])

    return { streak, isLoading }
}