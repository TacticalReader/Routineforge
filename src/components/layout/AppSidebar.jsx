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

function AppSidebar({ isOpen, onClose }) {
    return (
        <>
            {/* Dark overlay (mobile only, via CSS) */}
            <div
                className={`sidebar-overlay${isOpen ? ' open' : ''}`}
                onClick={onClose}
            />

            <aside className={`app-sidebar${isOpen ? ' open' : ''}`}>
                <nav>
                    <NavLink to="/" end style={linkStyle} onClick={onClose}>
                        <LayoutDashboard size={18} />
                        Dashboard
                    </NavLink>
                    <NavLink to="/settings" style={linkStyle} onClick={onClose}>
                        <Settings size={18} />
                        Settings
                    </NavLink>
                </nav>
            </aside>
        </>
    )
}

export default AppSidebar