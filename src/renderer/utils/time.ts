export const DAYS_FULL = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
]

export const DAYS_SHORT = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB']
export const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export const secondsToMinutes = (seconds: number): number => {
    return seconds / 60
}

export const secondsToHours = (seconds: number): number => {
    return seconds / 3600
}

export const formatMinutes = (minutes: number): string => {
    if (minutes < 60) return `${Math.round(minutes)}min`

    const hours = Math.floor(minutes / 60)
    const mins = Math.round(minutes % 60)
    return `${hours}h ${mins}min`
}


export const calculateSessionStats = (sessions: any[]) => {
    if (sessions.length === 0) {
        return {
            totalMinutes: 0,
            totalSessions: 0,
            daysActive: 0,
            averagePerDay: 0,
        }
    }

    const totalSeconds = sessions.reduce((sum, s) => sum + s.duration, 0)
    const totalMinutes = secondsToMinutes(totalSeconds)

    const uniqueDays = new Set(sessions.map(s => s.dayOfWeek))
    const daysActive = uniqueDays.size

    const averagePerDay = daysActive > 0 ? totalMinutes / daysActive : 0

    return {
        totalMinutes,
        totalSessions: sessions.length,
        daysActive,
        averagePerDay,
    }
}

export const calculateHoursByDay = (sessions: any[]) => {
    const minutesByDay: { [key: number]: number } = {
        0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0
    }

    sessions.forEach(session => {
        const minutes = secondsToMinutes(session.duration)
        minutesByDay[session.dayOfWeek] += minutes
    })

    const result = DAYS.map((day, index) => ({
        day,
        minutes: Math.round(minutesByDay[index]),
    }))

    return result
}

export const formatTime = (date: Date): string => {
    return `${date.getHours().toString().padStart(2, '0')}:${date
        .getMinutes()
        .toString()
        .padStart(2, '0')}`
}

export const formatTimeDisplay = (secondsTotal: number) => {
    const totalMinutes = secondsToMinutes(secondsTotal)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = Math.floor(totalMinutes % 60)
    const seconds = secondsTotal % 60

    return {
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0'),
    }
}