import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardPage from '../pages/DashboardPage'
import { useAuthSession } from '../hooks/useAuthSession'
import AuthPage from '../pages/AuthPage'
import AppHeader from '../components/layout/AppHeader'
import AppSidebar from '../components/layout/AppSidebar'
import AppFooter from '../components/layout/AppFooter'
import HabitDetailPage from '../pages/HabitDetailPage'
import SettingsPage from '../pages/SettingsPage'

// Temporary placeholders — replaced by real imports in Phase 5, 7, and 9
// once DashboardPage.jsx, HabitDetailPage.jsx, and SettingsPage.jsx exist.
function DashboardPlaceholder() {
    return <div style={{ padding: '2rem' }}>
        <DashboardPage />
    </div>
}
function HabitDetailPlaceholder() {
    return <div style={{ padding: '2rem' }}><HabitDetailPage /></div>
}
function SettingsPlaceholder() {
    return <div style={{ padding: '2rem' }}><SettingsPage /></div>
}

function ProtectedLayout({ children }) {
    const { user, isLoading } = useAuthSession()

    if (isLoading) {
        return <p style={{ padding: '2rem' }}>Loading...</p>
    }

    if (!user) {
        return <Navigate to="/auth" replace />
    }

    return (
        <div className="app-shell">
            <AppHeader />
            <div style={{ display: 'flex', flex: 1 }}>
                <AppSidebar />
                <main style={{ flex: 1, padding: '1.5rem' }}>{children}</main>
            </div>
            <AppFooter />
        </div>
    )
}

function AppRoutes() {
    return (
        <Routes>
            <Route path="/auth" element={<AuthPage />} />

            <Route
                path="/"
                element={
                    <ProtectedLayout>
                        <DashboardPlaceholder />
                    </ProtectedLayout>
                }
            />

            <Route
                path="/habit/:habitId"
                element={
                    <ProtectedLayout>
                        <HabitDetailPlaceholder />
                    </ProtectedLayout>
                }
            />

            <Route
                path="/settings"
                element={
                    <ProtectedLayout>
                        <SettingsPlaceholder />
                    </ProtectedLayout>
                }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

export default AppRoutes