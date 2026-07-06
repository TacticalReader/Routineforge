import { supabase } from '../../services/supabaseClient'
import { useAuthSession } from '../../hooks/useAuthSession'
import { Activity, LogOut } from 'lucide-react'

function AppHeader() {
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
            <h1 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Activity size={20} />
                RoutineForge
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {user && <span style={{ fontSize: '0.85rem' }}>{user.email}</span>}
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