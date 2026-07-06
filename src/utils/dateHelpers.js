export function toDateString(date) {
    return date.toISOString().split('T')[0]
}

export function getTodayDateString() {
    return toDateString(new Date())
}

export function getYesterdayDateString() {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    return toDateString(yesterday)
}

export function daysBetween(earlierDateString, laterDateString) {
    const earlier = new Date(earlierDateString)
    const later = new Date(laterDateString)
    const diffMs = later.getTime() - earlier.getTime()
    return Math.round(diffMs / (1000 * 60 * 60 * 24))
}

export function isConsecutiveDay(previousDateString, currentDateString) {
    return daysBetween(previousDateString, currentDateString) === 1
}