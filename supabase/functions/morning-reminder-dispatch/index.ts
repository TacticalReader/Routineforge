import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const resendApiKey = Deno.env.get('RESEND_API_KEY')!

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function sendReminderEmail(toEmail: string, habitTitles: string[]) {
    const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            // Replace yourdomain.com with your Resend-verified domain
            // before deploying — Resend rejects unverified sender addresses.
            from: 'RoutineForge <reminders@yourdomain.com>',
            to: toEmail,
            subject: "Don't break your streak today",
            html: `<p>You have a live streak on: ${habitTitles.join(', ')}. Keep it going today!</p>`,
        }),
    })
    // Surface Resend errors instead of silently counting failures as sends.
    if (!res.ok) {
        const body = await res.text()
        throw new Error(`Resend error ${res.status}: ${body}`)
    }
}

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    // Only remind users who actually have something to protect — no
    // point nagging someone with zero active streaks.
    const { data: streakRows, error } = await supabase
        .from('streaks')
        .select('habit_id, user_id, current_streak, habits(title)')
        .gt('current_streak', 0)

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }

    const habitTitlesByUser = new Map<string, string[]>()
    // streakRows can be null (not []) when the query returns no rows.
    for (const row of streakRows ?? []) {
        const titles = habitTitlesByUser.get(row.user_id) || []
        titles.push(row.habits?.title ?? 'a habit')
        habitTitlesByUser.set(row.user_id, titles)
    }

    let sentCount = 0
    for (const [userId, habitTitles] of habitTitlesByUser) {
        const { data: userData } = await supabase.auth.admin.getUserById(userId)
        const email = userData?.user?.email
        if (email) {
            await sendReminderEmail(email, habitTitles)
            sentCount += 1
        }
    }

    return new Response(JSON.stringify({ remindersSent: sentCount }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
})