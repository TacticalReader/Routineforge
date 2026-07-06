import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import { LogIn, UserPlus, AlertCircle, ArrowRight } from 'lucide-react'

function AuthPage() {
    const [mode, setMode] = useState('signin') // 'signin' | 'signup'
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(event) {
        event.preventDefault()
        setErrorMessage('')
        setIsSubmitting(true)

        const authCall =
            mode === 'signin'
                ? supabase.auth.signInWithPassword({ email, password })
                : supabase.auth.signUp({ email, password })

        const { error } = await authCall
        setIsSubmitting(false)

        if (error) {
            setErrorMessage(error.message)
            return
        }

        navigate('/')
    }

    return (
        <div style={{ maxWidth: '380px', margin: '4rem auto', padding: '0 1rem' }}>
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {mode === 'signin' ? <LogIn size={24} /> : <UserPlus size={24} />}
                {mode === 'signin' ? 'Log in to RoutineForge' : 'Create your account'}
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    style={{ padding: '0.6rem', border: '3px solid #111111' }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    minLength={6}
                    style={{ padding: '0.6rem', border: '3px solid #111111' }}
                />

                {errorMessage && (
                    <p style={{ color: '#B00020', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <AlertCircle size={16} />
                        {errorMessage}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                    }}
                >
                    {mode === 'signin' ? <LogIn size={18} /> : <UserPlus size={18} />}
                    {isSubmitting ? 'Please wait...' : mode === 'signin' ? 'Log In' : 'Sign Up'}
                </button>
            </form>

            <button
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                style={{
                    marginTop: '1rem',
                    background: 'transparent',
                    boxShadow: 'none',
                    border: 'none',
                    textDecoration: 'underline',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: 0,
                }}
            >
                <ArrowRight size={16} />
                {mode === 'signin' ? 'Need an account? Sign up' : 'Already have an account? Log in'}
            </button>
        </div>
    )
}

export default AuthPage