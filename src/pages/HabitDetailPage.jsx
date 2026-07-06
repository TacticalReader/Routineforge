import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, FileText, History, Info, Calendar } from 'lucide-react'
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

            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                <FileText size={24} />
                {habit.title}
            </h2>
            {habit.description && <p style={{ marginBottom: '1rem', color: '#555' }}>{habit.description}</p>}

            <div style={{ marginBottom: '1.5rem' }}>
                <HabitCompletionToggle habitId={habit.id} />
            </div>

            <StreakBadge
                currentStreak={cachedStreak ?? currentStreak}
                longestStreak={longestStreak}
            />

            <h3 style={{ marginTop: '2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <History size={18} />
                Completion History
            </h3>
            {completionDates.length === 0 ? (
                <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#666', fontSize: '0.9rem' }}>
                    <Info size={16} />
                    No completions recorded yet — this fills in once the nightly cron
                    finalizes each day.
                </p>
            ) : (
                <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                    {completionDates
                        .slice()
                        .reverse()
                        .map((date) => (
                            <li key={date} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', margin: '0.4rem 0' }}>
                                <Calendar size={14} color="#666" />
                                {date}
                            </li>
                        ))}
                </ul>
            )}
        </div>
    )
}

export default HabitDetailPage