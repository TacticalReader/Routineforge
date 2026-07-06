import { supabase } from '../../services/supabaseClient'
import { useAuthSession } from '../../hooks/useAuthSession'
import { Activity, LogOut, Menu } from 'lucide-react'

function AppHeader({ onMenuToggle }) {
    const { user } = useAuthSession()

    async function handleLogout() {
        await supabase.auth.signOut()
    }

    return (
        <header
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem 1.5rem',
                borderBottom: '3px solid #111111',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {/* Hamburger — visible only on mobile via CSS */}
                <button
                    className="mobile-menu-btn"
                    onClick={onMenuToggle}
                    aria-label="Toggle navigation menu"
                >
                    <Menu size={22} />
                </button>
                <h1 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Activity size={20} />
                    RoutineForge
                </h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {user && <span className="header-email">{user.email}</span>}
                <button
                    onClick={handleLogout}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                    }}
                >
                    <LogOut size={16} />
                    Log Out
                </button>
            </div>
        </header>
    )
}

export default AppHeader