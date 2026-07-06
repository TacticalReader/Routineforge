import { Code2 } from 'lucide-react'

function AppFooter() {
    return (
        <footer
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                padding: '1rem 1.5rem',
                borderTop: '3px solid #111111',
                fontSize: '0.8rem',
            }}
        >
            <Code2 size={14} />
            <span>RoutineForge — built to learn Redis and cron jobs.</span>
        </footer>
    )
}

export default AppFooter