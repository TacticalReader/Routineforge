import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2, ChevronRight } from 'lucide-react'
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
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '0.75rem',
            }}
        >
            {/* Left section: title + description */}
            <div style={{ flex: '1 1 0', minWidth: '150px' }}>
                <Link
                    to={`/habit/${habit.id}`}
                    style={{
                        fontWeight: 700,
                        textDecoration: 'underline',
                        textDecorationColor: 'var(--color-accent)',
                        textUnderlineOffset: '3px',
                        textDecorationThickness: '2px',
                        color: 'inherit',
                        transition: 'color 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#555'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'inherit'
                    }}
                >
                    {habit.title}
                </Link>
                {habit.description && (
                    <p style={{ fontSize: '0.85rem', marginTop: '0.25rem', color: '#555' }}>
                        {habit.description}
                    </p>
                )}
            </div>

            {/* Right section: action buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                <Link
                    to={`/habit/${habit.id}`}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        padding: '0.45rem 0.8rem',
                        border: '3px solid #111111',
                        background: 'var(--color-accent)',
                        color: 'var(--color-ink)',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        textDecoration: 'none',
                        boxShadow: '3px 3px 0 #111111',
                        transition: 'transform 0.1s ease, box-shadow 0.1s ease',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                    }}
                    onMouseDown={(e) => {
                        e.currentTarget.style.transform = 'translate(1px, 1px)'
                        e.currentTarget.style.boxShadow = '1px 1px 0 #111111'
                    }}
                    onMouseUp={(e) => {
                        e.currentTarget.style.transform = 'none'
                        e.currentTarget.style.boxShadow = '3px 3px 0 #111111'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'none'
                        e.currentTarget.style.boxShadow = '3px 3px 0 #111111'
                    }}
                >
                    Details
                    <ChevronRight size={16} />
                </Link>

                <AppButton variant="danger" icon={Trash2} onClick={() => setIsConfirmOpen(true)}>
                    Delete
                </AppButton>
            </div>

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
                        icon={Trash2}
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