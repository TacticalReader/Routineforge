import { supabase } from './supabaseClient'

// Browser-side notifications — instant, in-app feedback. Separate from
// the actual email reminders the morning-reminder-dispatch function
// sends; this is for things like confirming a toggle succeeded.
export async function requestNotificationPermission() {
    if (!('Notification' in window)) return 'unsupported'
    if (Notification.permission === 'granted') return 'granted'
    return Notification.requestPermission()
}

export function showBrowserNotification(title, body) {
    if (!('Notification' in window) || Notification.permission !== 'granted') return
    new Notification(title, { body })
}

// Lets the Settings page (Phase 9) manually trigger the reminder
// function on demand — useful for testing the cron logic without
// waiting for the actual 8 AM schedule to fire.
export async function triggerReminderTest() {
    const { data, error } = await supabase.functions.invoke('morning-reminder-dispatch')
    if (error) throw error
    return data
}