import { DaySession, SessionsListProps } from "../types/components"
import { DAYS_FULL, DAYS_SHORT, formatDuration, formatTime } from "../utils/time"

export function SessionsList({ sessions = [], isLoading = false, onDelete }: SessionsListProps) {
    const today = new Date().getDay()

    // Group and process sesions by day
    const processedDays: DaySession[] = Array.from({ length: 7 }, (_, i) => {
        const daySessions = sessions.filter(s => s.dayOfWeek === i)
        const totalDuration = daySessions.reduce((acc, s) => acc + s.duration, 0)

        return {
            dayIndex: i,
            dayName: DAYS_FULL[i],
            dayShort: DAYS_SHORT[i],
            dayNumber: getDayNumber(i),
            totalDuration,
            sessionCount: daySessions.length,
            sessions: daySessions,
            isToday: i === today,
            progressPercentage: 0,
        }
    }).filter(day => day.sessionCount > 0)

    // Calculate progress
    const maxDuration = Math.max(...processedDays.map(d => d.totalDuration), 1)
    processedDays.forEach(day => {
        day.progressPercentage = (day.totalDuration / maxDuration) * 100
    })

    // Loading state
    if (isLoading) {
        return (
            <div className="card mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-foreground">Sessões da semana</h2>
                </div>
                <div className="flex items-center justify-center py-12 text-muted-foreground">
                    Carregando…
                </div>
            </div>
        )
    }

    // Empty state
    if (processedDays.length === 0) {
        return (
            <div className="card mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-foreground">Sessões da semana</h2>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground border border-border rounded-full px-3 py-1">
                        EXEMPLO
                    </span>
                </div>
                <div className="flex items-center justify-center py-12 text-center text-muted-foreground">
                    <div>
                        <p className="text-sm">Nenhuma sessão ainda.</p>
                        <p className="text-sm">Inicie o cronômetro acima.</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="card mb-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-semibold text-foreground">Sessões da semana</h2>
            </div>

            {/* Days */}
            <div className="space-y-4">
                {processedDays.map(day => (
                    <DayCard key={day.dayIndex} day={day} onDelete={onDelete} />
                ))}
            </div>
        </div>
    )
}

// Component for each day
function DayCard({
    day,
    onDelete,
}: {
    day: DaySession
    onDelete?: (sessionId: string) => void
}) {
    const progressColor = day.isToday
        ? 'var(--gradient-primary)'
        : 'oklch(0.5 0.08 75 / 0.7)'

    const progressTrackColor = day.isToday
        ? 'oklch(0.5 0.08 75 / 0.3)'
        : 'var(--card-light)'

    return (
        <div className={`day-card group ${day.isToday ? 'is-today' : ''}`}>
            <div className="day-card-content">
                <div className="flex items-center gap-4 mb-3">
                    <div className="day-block">
                        <div className="day-block-label">{day.dayShort}</div>
                        <div className="day-block-number">{day.dayNumber}</div>
                    </div>

                    <div className="text-xl font-semibold text-foreground font-mono">
                        {formatDuration(day.totalDuration)}
                    </div>

                    <div
                        className="flex-1 h-1.5 rounded-full overflow-hidden"
                        style={{ backgroundColor: progressTrackColor }}
                    >
                        <div
                            className="h-full transition-all duration-300 rounded-full"
                            style={{
                                width: `${day.progressPercentage}%`,
                                background: progressColor,
                            }}
                        />
                    </div>

                    {day.isToday && (
                        <span className="text-xs uppercase tracking-wider font-semibold bg-primary-subtle text-primary px-2 py-1 rounded-full whitespace-nowrap">
                            Hoje
                        </span>
                    )}
                </div>

                <div className="mb-4 text-xs text-muted-foreground">
                    {day.sessionCount} {day.sessionCount === 1 ? 'sessão' : 'sessões'}
                </div>

                <div className="flex flex-wrap gap-2">
                    {day.sessions.map(session => (
                        <div
                            key={session.id}
                            className="session-pill"
                        >
                            <span className="session-pill-time">
                                {formatTime(session.startTime)}
                            </span>
                            <div className="session-pill-divider" />
                            <span className="session-pill-duration">
                                {formatDuration(session.duration)}
                            </span>
                            <button
                                onClick={() => onDelete?.(session.id)}
                                className="session-pill-delete"
                                title="Deletar sessão"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// Helpers
function getDayNumber(dayIndex: number): number {
    const today = new Date()
    const currentDay = today.getDate()
    const currentDayOfWeek = today.getDay()
    const diff = dayIndex - currentDayOfWeek
    return currentDay + diff
}
