import { useContext } from 'react'
import { SessionContext } from '../context/SessionProvider'

export function useAuthSession() {
    const context = useContext(SessionContext)

    if (context === undefined) {
        throw new Error('useAuthSession must be used within a SessionProvider')
    }

    return context
}