import { useState } from 'react'
import { Plus, Target, AlignLeft } from 'lucide-react'

function HabitForm({ onSubmit }) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function handleSubmit(event) {
        event.preventDefault()
        if (!title.trim() || !description.trim()) return

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
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                border: '3px solid #111111', 
                background: 'var(--color-bg)',
                padding: '0 0.6rem',
                flex: '1 1 200px'
            }}>
                <Target size={18} color="#666" />
                <input
                    type="text"
                    placeholder="Habit title (e.g. Read 30 mins)"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    required
                    style={{ 
                        border: 'none', 
                        outline: 'none', 
                        padding: '0.6rem', 
                        flex: 1,
                        background: 'transparent',
                        fontFamily: 'inherit',
                        fontSize: 'inherit',
                        color: 'inherit'
                    }}
                />
            </div>
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                border: '3px solid #111111', 
                background: 'var(--color-bg)',
                padding: '0 0.6rem',
                flex: '1 1 200px'
            }}>
                <AlignLeft size={18} color="#666" />
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    required
                    style={{ 
                        border: 'none', 
                        outline: 'none', 
                        padding: '0.6rem', 
                        flex: 1,
                        background: 'transparent',
                        fontFamily: 'inherit',
                        fontSize: 'inherit',
                        color: 'inherit'
                    }}
                />
            </div>
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