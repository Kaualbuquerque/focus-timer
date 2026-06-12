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

// SESSIONS

export interface Session {
    id: string
    dayOfWeek: number
    startTime: Date
    duration: number
    completed: boolean
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