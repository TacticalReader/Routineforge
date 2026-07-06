import { supabase } from './supabaseClient'

export async function fetchHabits(userId) {
    const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

    if (error) throw error
    return data
}

export async function createHabit(userId, { title, description }) {
    const { data, error } = await supabase
        .from('habits')
        .insert({ user_id: userId, title, description })
        .select()
        .single()

    if (error) throw error
    return data
}

export async function updateHabit(habitId, updates) {
    const { data, error } = await supabase
        .from('habits')
        .update(updates)
        .eq('id', habitId)
        .select()
        .single()

    if (error) throw error
    return data
}

export async function deleteHabit(habitId) {
    // Soft delete rather than a hard row delete — keeps historical
    // completions and streak data intact even after a habit is removed
    // from the dashboard.
    const { error } = await supabase
        .from('habits')
        .update({ is_active: false })
        .eq('id', habitId)

    if (error) throw error
}