import { createContext, useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'

export const SessionContext = createContext(undefined)

export function SessionProvider({ children }) {
    const [session, setSession] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        let isMounted = true

        supabase.auth.getSession().then(({ data }) => {
            if (!isMounted) return
            setSession(data.session)
            setIsLoading(false)
        })

        const { data: authListener } = supabase.auth.onAuthStateChange(
            (_event, newSession) => {
                setSession(newSession)
            }
        )

        return () => {
            isMounted = false
            authListener.subscription.unsubscribe()
        }
    }, [])

    const value = {
        session,
        user: session?.user ?? null,
        isLoading,
    }

    return (
        <SessionContext.Provider value={value}>
            {children}
        </SessionContext.Provider>
    )
}