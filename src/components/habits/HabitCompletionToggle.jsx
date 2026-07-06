import { useEffect, useState } from 'react'
import { Check, Circle, Loader2 } from 'lucide-react'
import {
    markHabitComplete,
    unmarkHabitComplete,
    getTodayCompletions,
} from '../../services/redisCacheService'
import { useAuthSession } from '../../hooks/useAuthSession'

function getTodayString() {
    return new Date().toISOString().split('T')[0]
}

function HabitCompletionToggle({ habitId }) {
    const { user } = useAuthSession()
    const [isComplete, setIsComplete] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        let isMounted = true

        async function loadState() {
            if (!user) return
            const today = getTodayString()
            const completions = await getTodayCompletions(user.id, today)
            if (isMounted) {
                setIsComplete(Boolean(completions[habitId]))
                setIsLoading(false)
            }
        }

        loadState()
        return () => {
            isMounted = false
        }
    }, [user, habitId])

    async function handleToggle() {
        if (!user) return
        const today = getTodayString()
        const nextState = !isComplete

        setIsComplete(nextState) // optimistic UI update

        if (nextState) {
            await markHabitComplete(user.id, habitId, today)
        } else {
            await unmarkHabitComplete(user.id, habitId, today)
        }
    }

    if (isLoading) {
        return <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
    }

    return (
        <button
            onClick={handleToggle}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: isComplete ? 'var(--color-accent)' : 'var(--color-bg)',
            }}
        >
            {isComplete ? <Check size={18} /> : <Circle size={18} />}
            {isComplete ? 'Done Today' : 'Mark Done'}
        </button>
    )
}

export default HabitCompletionToggle