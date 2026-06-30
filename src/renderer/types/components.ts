import { ReactNode } from "react"

// HEADER
export interface HeaderProps {
    date?: Date
}

// TIMER
export interface TimerState {
    hours: string
    minutes: string
    seconds: string
}

// STAT CARD
export interface StatCardProps {
    icon: ReactNode
    label: string
    value: string
}

// HOURS PER DAY
export interface HoursPerDayProps {
    sessions?: Array<{
        dayOfWeek: number
        duration: number
    }>
}

// SESSIONS

export interface Session {
    id: string
    dayOfWeek: number
    startTime: Date
    duration: number
    completed: boolean
    createdAt: Date
}

export interface SessionsListProps {
    sessions?: Session[]
    isLoading?: boolean
    onDelete?: (sessionId: string) => void
}

export interface DaySession {
    dayIndex: number
    dayName: string
    dayShort: string
    dayNumber: number
    totalDuration: number
    sessionCount: number
    sessions: Session[]
    isToday: boolean
    progressPercentage: number
}

// PAGE TYPES
export type Page = 'home' | 'history' | 'week-detail'

export interface WeekData {
    weekStart: Date
    weekEnd: Date
    sessions: Session[]
}

// TITLEBAR
export interface TitleBarProps {
    onHistoryClick: () => void
    currentPage: Page
}

// HISTORY PAGE

export interface historyPageProps {
    onBack: () => void
    onWeekSelect: (week: WeekData) => void
}

// WEEK DATAIL
export interface WeekDatailPageProps {
    week: WeekData
    onBack: () => void
}