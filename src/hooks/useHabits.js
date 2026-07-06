import { useCallback, useEffect, useState } from 'react'
import { useAuthSession } from './useAuthSession'
import {
    fetchHabits,
    createHabit,
    updateHabit,
    deleteHabit,
} from '../services/habitService'

export function useHabits() {
    const { user } = useAuthSession()
    const [habits, setHabits] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const loadHabits = useCallback(async () => {
        if (!user) return
        setIsLoading(true)
        try {
            const data = await fetchHabits(user.id)
            setHabits(data)
            setError(null)
        } catch (err) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }, [user])

    useEffect(() => {
        loadHabits()
    }, [loadHabits])

    async function addHabit(formValues) {
        const newHabit = await createHabit(user.id, formValues)
        setHabits((prev) => [newHabit, ...prev])
    }

    async function editHabit(habitId, updates) {
        const updated = await updateHabit(habitId, updates)
        setHabits((prev) => prev.map((h) => (h.id === habitId ? updated : h)))
    }

    async function removeHabit(habitId) {
        await deleteHabit(habitId)
        setHabits((prev) => prev.filter((h) => h.id !== habitId))
    }

    return {
        habits,
        isLoading,
        error,
        addHabit,
        editHabit,
        removeHabit,
        refresh: loadHabits,
    }
}