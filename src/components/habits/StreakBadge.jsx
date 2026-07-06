import { Flame, Trophy } from 'lucide-react'

function StreakBadge({ currentStreak, longestStreak }) {
    return (
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Flame size={20} color={currentStreak > 0 ? '#FF6B00' : '#999999'} />
                <span style={{ fontWeight: 700 }}>
                    {currentStreak} day{currentStreak === 1 ? '' : 's'}
                </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Trophy size={18} color="#111111" />
                <span style={{ fontSize: '0.85rem' }}>Best: {longestStreak}</span>
            </div>
        </div>
    )
}

export default StreakBadge