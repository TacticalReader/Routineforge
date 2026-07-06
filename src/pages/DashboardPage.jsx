import { useHabits } from '../hooks/useHabits'
import HabitForm from '../components/habits/HabitForm'
import HabitCard from '../components/habits/HabitCard'
import LoadingSpinner from '../components/common/LoadingSpinner'

function DashboardPage() {
    const { habits, isLoading, error, addHabit, removeHabit } = useHabits()

    if (isLoading) return <LoadingSpinner label="Loading habits..." />
    if (error) return <p style={{ color: '#B00020' }}>{error}</p>

    return (
        <div>
            <h2 style={{ marginBottom: '1rem' }}>Your Habits</h2>
            <HabitForm onSubmit={addHabit} />

            {habits.length === 0 ? (
                <p>No habits yet — add your first one above.</p>
            ) : (
                habits.map((habit) => (
                    <HabitCard key={habit.id} habit={habit} onDelete={removeHabit} />
                ))
            )}
        </div>
    )
}

export default DashboardPage