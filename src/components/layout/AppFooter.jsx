import { useEffect, useState } from 'react'
import { Code2, Star, Heart, User } from 'lucide-react'

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
                padding: '1.25rem 1.5rem',
                borderTop: '3px solid #111111',
                background: '#111111',
                color: '#e0e0e0',
                fontSize: '0.82rem',
                lineHeight: 1.7,
            }}
        >
            {/* ── Top row: branding + GitHub link ── */}
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '0.75rem',
                }}
            >
                {/* Branding */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <Code2 size={16} color="#D6F84C" />
                    <span style={{ fontWeight: 700, color: '#ffffff' }}>RoutineForge</span>
                    <span style={{ color: '#999' }}>— built to learn Redis &amp; cron jobs.</span>
                </div>

                {/* GitHub link + star count */}
                <a
                    href={REPO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        color: '#e0e0e0',
                        textDecoration: 'none',
                        background: '#222',
                        border: '2px solid #333',
                        borderRadius: '6px',
                        padding: '0.3rem 0.7rem',
                        transition: 'border-color 0.2s ease, background 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#D6F84C'
                        e.currentTarget.style.background = '#2a2a2a'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#333'
                        e.currentTarget.style.background = '#222'
                    }}
                >
                    <GithubIcon size={15} />
                    <span style={{ fontWeight: 600 }}>TacticalReader</span>
                    {starCount !== null && (
                        <>
                            <span style={{ color: '#555', margin: '0 0.15rem' }}>·</span>
                            <Star size={13} color="#f0c14b" fill="#f0c14b" />
                            <span style={{ fontWeight: 700, color: '#f0c14b' }}>
                                {starCount}
                            </span>
                        </>
                    )}
                </a>
            </div>

            {/* ── Divider ── */}
            <hr
                style={{
                    border: 'none',
                    borderTop: '1px solid #2a2a2a',
                    margin: '0.7rem 0',
                }}
            />

            {/* ── Bottom row: credits + star CTA ── */}
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.78rem',
                    color: '#999',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <User size={13} color="#D6F84C" />
                    <span>Designed &amp; programmed by</span>
                    <span style={{ fontWeight: 700, color: '#ffffff' }}>TanmaySrivastava</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span>If you liked this project, give it a</span>
                    <Heart size={13} color="#FF6B6B" fill="#FF6B6B" />
                    <a
                        href={REPO_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            fontWeight: 700,
                            color: '#D6F84C',
                            textDecoration: 'underline',
                            textUnderlineOffset: '2px',
                        }}
                    >
                        star on GitHub
                    </a>
                </div>
            </div>
        </footer>
    )
}

export default AppFooter