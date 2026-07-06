import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Settings } from 'lucide-react'

const linkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.6rem 0',
    fontWeight: isActive ? 700 : 500,
    textDecoration: isActive ? 'underline' : 'none',
})

function AppSidebar() {
    return (
        <aside
            style={{
                width: '180px',
                padding: '1.5rem 1rem',
                borderRight: '3px solid #111111',
            }}
        >
            <nav>
                <NavLink to="/" end style={linkStyle}>
                    <LayoutDashboard size={18} />
                    Dashboard
                </NavLink>
                <NavLink to="/settings" style={linkStyle}>
                    <Settings size={18} />
                    Settings
                </NavLink>
            </nav>
        </aside>
    )
}

export default AppSidebar