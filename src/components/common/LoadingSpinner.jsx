import { Loader2 } from 'lucide-react'

function LoadingSpinner({ label = 'Loading...' }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 0' }}>
            <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
            <span>{label}</span>
        </div>
    )
}

export default LoadingSpinner