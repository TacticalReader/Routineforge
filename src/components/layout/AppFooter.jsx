import { useEffect, useState } from 'react'
import { Code2, Star, Heart, User, ExternalLink, Zap } from 'lucide-react'

const REPO_OWNER = 'TacticalReader'
const REPO_NAME = 'Routineforge'
const REPO_URL = `https://github.com/${REPO_OWNER}/${REPO_NAME}`

// Custom GitHub SVG component to bypass missing Lucide brand icons
const GithubIcon = ({ size = 24, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5" />
        <path d="M12 2C6.5 2 2 6.5 2 12c0 4.4 2.9 8.1 6.8 9.4.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.4-3.4-1.4-.4-1-.9-1.3-.9-1.3-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.2 1.8.9 2.2.7.1-.5.3-.9.5-1.1-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.3-3.2-.1-.3-.6-1.5.1-3.1 0 0 1.1-.3 3.5 1.3 1-.3 2-.4 3-.4s2 .1 3 .4c2.4-1.6 3.5-1.3 3.5-1.3.7 1.6.3 2.8.1 3.1.8.8 1.3 1.9 1.3 3.2 0 4.7-2.8 5.7-5.5 6 .4.4.7 1.1.7 2.2v3.3c0 .3.2.6.7.5C19.1 20.1 22 16.4 22 12 22 6.5 17.5 2 12 2z" />
    </svg>
)

function AppFooter() {
    const [starCount, setStarCount] = useState(null)

    useEffect(() => {
        let cancelled = false
        async function fetchStars() {
            try {
                const response = await fetch(
                    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`
                )
                if (!response.ok) return
                const data = await response.json()
                if (!cancelled) setStarCount(data.stargazers_count)
            } catch {
                // silently ignore – footer still works without star count
            }
        }
        fetchStars()
        return () => {
            cancelled = true
        }
    }, [])

    return (
        <footer
            style={{
                padding: '2rem 2.5rem',
                borderTop: '3px solid var(--color-accent)',
                background: '#0a0a0a',
                color: '#c0c0c0',
                fontSize: '0.84rem',
                lineHeight: 1.8,
            }}
        >
            {/* ── Main grid: 3 columns on desktop, stacks on mobile ── */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '2rem',
                    maxWidth: '1100px',
                    margin: '0 auto',
                }}
            >
                {/* Column 1: Branding */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <Code2 size={20} color="#D6F84C" />
                        <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#ffffff', letterSpacing: '-0.02em' }}>
                            RoutineForge
                        </span>
                    </div>
                    <p style={{ color: '#888', fontSize: '0.82rem', maxWidth: '260px' }}>
                        A habit tracker built to master Redis caching and cron job scheduling in a real-world project.
                    </p>
                </div>

                {/* Column 2: Built With */}
                <div>
                    <h4 style={{ color: '#ffffff', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Zap size={14} color="#D6F84C" />
                        Built With
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {['React', 'Vite', 'Supabase', 'Upstash Redis', 'Resend'].map((tech) => (
                            <span
                                key={tech}
                                style={{
                                    display: 'inline-block',
                                    padding: '0.2rem 0.6rem',
                                    background: '#1a1a1a',
                                    border: '1px solid #2a2a2a',
                                    borderRadius: '4px',
                                    fontSize: '0.78rem',
                                    color: '#aaa',
                                }}
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Column 3: Connect */}
                <div>
                    <h4 style={{ color: '#ffffff', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <ExternalLink size={14} color="#D6F84C" />
                        Connect
                    </h4>
                    <a
                        href={REPO_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            color: '#e0e0e0',
                            textDecoration: 'none',
                            background: '#1a1a1a',
                            border: '2px solid #2a2a2a',
                            borderRadius: '8px',
                            padding: '0.5rem 0.9rem',
                            transition: 'border-color 0.2s ease, background 0.2s ease, transform 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#D6F84C'
                            e.currentTarget.style.background = '#1e1e1e'
                            e.currentTarget.style.transform = 'translateY(-1px)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#2a2a2a'
                            e.currentTarget.style.background = '#1a1a1a'
                            e.currentTarget.style.transform = 'none'
                        }}
                    >
                        <GithubIcon size={16} />
                        <span style={{ fontWeight: 600, fontSize: '0.84rem' }}>TacticalReader</span>
                        {starCount !== null && (
                            <>
                                <span style={{ color: '#444', margin: '0 0.1rem' }}>·</span>
                                <Star size={13} color="#f0c14b" fill="#f0c14b" />
                                <span style={{ fontWeight: 700, color: '#f0c14b', fontSize: '0.82rem' }}>
                                    {starCount}
                                </span>
                            </>
                        )}
                    </a>
                </div>
            </div>

            {/* ── Divider ── */}
            <hr
                style={{
                    border: 'none',
                    borderTop: '1px solid #1e1e1e',
                    margin: '1.5rem auto 1rem',
                    maxWidth: '1100px',
                }}
            />

            {/* ── Bottom bar: credits + star CTA ── */}
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontSize: '0.78rem',
                    color: '#666',
                    maxWidth: '1100px',
                    margin: '0 auto',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <User size={13} color="#D6F84C" />
                    <span>Designed &amp; built by</span>
                    <span style={{ fontWeight: 700, color: '#d0d0d0' }}>TanmaySrivastava</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span>If you liked this, give it a</span>
                    <Heart size={13} color="#FF6B6B" fill="#FF6B6B" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
                    <a
                        href={REPO_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            fontWeight: 700,
                            color: '#D6F84C',
                            textDecoration: 'underline',
                            textUnderlineOffset: '3px',
                            textDecorationThickness: '2px',
                            transition: 'color 0.2s ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#e8ff7a' }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#D6F84C' }}
                    >
                        star on GitHub
                    </a>
                </div>
            </div>
        </footer>
    )
}

export default AppFooter