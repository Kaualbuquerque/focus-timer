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