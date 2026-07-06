import { useState } from 'react'
import { Plus } from 'lucide-react'

function HabitForm({ onSubmit }) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function handleSubmit(event) {
        event.preventDefault()
        if (!title.trim()) return

        setIsSubmitting(true)
        await onSubmit({ title: title.trim(), description: description.trim() })
        setTitle('')
        setDescription('')
        setIsSubmitting(false)
    }

    return (
        <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}
        >
            <input
                type="text"
                placeholder="Habit title (e.g. Read 30 mins)"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
                style={{ padding: '0.6rem', border: '3px solid #111111', flex: '1 1 200px' }}
            />
            <input
                type="text"
                placeholder="Description (optional)"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                style={{ padding: '0.6rem', border: '3px solid #111111', flex: '1 1 200px' }}
            />
            <button
                type="submit"
                disabled={isSubmitting}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                }}
            >
                <Plus size={16} />
                {isSubmitting ? 'Adding...' : 'Add Habit'}
            </button>
        </form>
    )
}

export default HabitForm