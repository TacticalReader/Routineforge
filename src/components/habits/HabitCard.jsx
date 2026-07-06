import { useState } from 'react'
import { Link } from 'react-router-dom'
import AppModal from '../common/AppModal'
import AppButton from '../common/AppButton'

function HabitCard({ habit, onDelete }) {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)

    return (
        <div
            style={{
                border: '3px solid #111111',
                padding: '1rem',
                marginBottom: '1rem',
                boxShadow: '4px 4px 0 #111111',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}
        >
            <div>
                <Link
                    to={`/habit/${habit.id}`}
                    style={{ fontWeight: 700, textDecoration: 'none', color: 'inherit' }}
                >
                    {habit.title}
                </Link>
                {habit.description && (
                    <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                        {habit.description}
                    </p>
                )}
            </div>

            <AppButton variant="danger" onClick={() => setIsConfirmOpen(true)}>
                Delete
            </AppButton>

            <AppModal
                isOpen={isConfirmOpen}
                title="Delete this habit?"
                onClose={() => setIsConfirmOpen(false)}
            >
                <p style={{ marginBottom: '1rem' }}>
                    This hides "{habit.title}" from your dashboard. Its history is kept.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <AppButton
                        variant="danger"
                        onClick={() => {
                            onDelete(habit.id)
                            setIsConfirmOpen(false)
                        }}
                    >
                        Yes, Delete
                    </AppButton>
                    <AppButton variant="ghost" onClick={() => setIsConfirmOpen(false)}>
                        Cancel
                    </AppButton>
                </div>
            </AppModal>
        </div>
    )
}

export default HabitCard