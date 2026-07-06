import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { supabase } from '../services/supabaseClient'
import { useStreakData } from '../hooks/useStreakData'
import { calculateStreaks } from '../utils/streakCalculator'
import HabitCompletionToggle from '../components/habits/HabitCompletionToggle'
import StreakBadge from '../components/habits/StreakBadge'

function HabitDetailPage() {
    const { habitId } = useParams()
    const [habit, setHabit] = useState(null)
    const [completionDates, setCompletionDates] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const { streak: cachedStreak } = useStreakData(habitId)

    useEffect(() => {
        async function loadHabit() {
            setIsLoading(true)

            const [{ data: habitData }, { data: completions }] = await Promise.all([
                supabase.from('habits').select('*').eq('id', habitId).single(),
                supabase
                    .from('habit_completions')
                    .select('completed_date')
                    .eq('habit_id', habitId)
                    .order('completed_date', { ascending: true }),
            ])

            setHabit(habitData)
            setCompletionDates((completions || []).map((row) => row.completed_date))
            setIsLoading(false)
        }

        loadHabit()
    }, [habitId])

    if (isLoading) return <p>Loading habit...</p>
    if (!habit) return <p>Habit not found.</p>

    const { currentStreak, longestStreak } = calculateStreaks(completionDates)

    return (
        <div>
            <Link
                to="/"
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    marginBottom: '1rem',
                    textDecoration: 'none',
                    color: 'inherit',
                }}
            >
                <ArrowLeft size={16} /> Back to Dashboard
            </Link>

            <h2>{habit.title}</h2>
            {habit.description && <p style={{ marginBottom: '1rem' }}>{habit.description}</p>}

            <div style={{ marginBottom: '1rem' }}>
                <HabitCompletionToggle habitId={habit.id} />
            </div>

            <StreakBadge
                currentStreak={cachedStreak ?? currentStreak}
                longestStreak={longestStreak}
            />

            <h3 style={{ marginTop: '2rem', marginBottom: '0.5rem' }}>Completion History</h3>
            {completionDates.length === 0 ? (
                <p>
                    No completions recorded yet — this fills in once the nightly cron
                    (Phase 8) finalizes each day.
                </p>
            ) : (
                <ul>
                    {completionDates
                        .slice()
                        .reverse()
                        .map((date) => (
                            <li key={date}>{date}</li>
                        ))}
                </ul>
            )}
        </div>
    )
}

export default HabitDetailPage