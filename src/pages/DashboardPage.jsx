import { useHabits } from '../hooks/useHabits'
import HabitForm from '../components/habits/HabitForm'
import HabitCard from '../components/habits/HabitCard'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { ClipboardList, AlertCircle, Sparkles } from 'lucide-react'

function DashboardPage() {
    const { habits, isLoading, error, addHabit, removeHabit } = useHabits()

    if (isLoading) return <LoadingSpinner label="Loading habits..." />
    if (error) {
        return (
            <p style={{ color: '#B00020', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={18} />
                {error}
            </p>
        )
    }

    return (
        <div>
            <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ClipboardList size={22} />
                Your Habits
            </h2>
            <HabitForm onSubmit={addHabit} />

            {habits.length === 0 ? (
                <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666' }}>
                    <Sparkles size={18} />
                    No habits yet — add your first one above.
                </p>
            ) : (
                habits.map((habit) => (
                    <HabitCard key={habit.id} habit={habit} onDelete={removeHabit} />
                ))
            )}
        </div>
    )
}

export default DashboardPage