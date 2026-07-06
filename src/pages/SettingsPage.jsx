import { useState } from 'react'
import { Bell, Send } from 'lucide-react'
import { useAuthSession } from '../hooks/useAuthSession'
import {
    requestNotificationPermission,
    triggerReminderTest,
} from '../services/notificationService'
import AppButton from '../components/common/AppButton'

function SettingsPage() {
    const { user } = useAuthSession()
    const [permissionStatus, setPermissionStatus] = useState(
        typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
    )
    const [testStatus, setTestStatus] = useState('')

    async function handleEnableNotifications() {
        const result = await requestNotificationPermission()
        setPermissionStatus(result)
    }

    async function handleSendTest() {
        setTestStatus('Sending...')
        try {
            const result = await triggerReminderTest()
            setTestStatus(`Sent ${result.remindersSent} reminder(s).`)
        } catch (err) {
            setTestStatus(`Failed: ${err.message}`)
        }
    }

    return (
        <div>
            <h2 style={{ marginBottom: '1rem' }}>Settings</h2>

            <section style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '0.5rem' }}>Account</h3>
                <p>{user?.email}</p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '0.5rem' }}>Browser Notifications</h3>
                <p style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    Status: {permissionStatus}
                </p>
                <AppButton
                    icon={Bell}
                    onClick={handleEnableNotifications}
                    disabled={permissionStatus === 'granted'}
                >
                    {permissionStatus === 'granted' ? 'Notifications Enabled' : 'Enable Notifications'}
                </AppButton>
            </section>

            <section>
                <h3 style={{ marginBottom: '0.5rem' }}>Test Reminder Cron</h3>
                <p style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    Manually triggers the morning-reminder-dispatch Edge Function from
                    Phase 8, without waiting for its 8 AM schedule.
                </p>
                <AppButton icon={Send} onClick={handleSendTest}>
                    Send Test Reminder
                </AppButton>
                {testStatus && <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>{testStatus}</p>}
            </section>
        </div>
    )
}

export default SettingsPage