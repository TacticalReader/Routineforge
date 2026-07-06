import { useEffect } from 'react'
import { X } from 'lucide-react'

function AppModal({ isOpen, title, children, onClose }) {
    useEffect(() => {
        function handleEscape(event) {
            if (event.key === 'Escape') onClose()
        }
        if (isOpen) document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(17, 17, 17, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 100,
            }}
        >
            <div
                onClick={(event) => event.stopPropagation()}
                style={{
                    background: 'var(--color-bg)',
                    border: '3px solid var(--color-border)',
                    boxShadow: '6px 6px 0 var(--color-ink)',
                    padding: '1.5rem',
                    minWidth: '280px',
                    maxWidth: '90vw',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1rem',
                    }}
                >
                    <h3>{title}</h3>
                    <button
                        onClick={onClose}
                        style={{ background: 'transparent', boxShadow: 'none', border: 'none', padding: '0.2rem' }}
                    >
                        <X size={18} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    )
}

export default AppModal