import { useEffect, useState } from "react";
import { Session, historyPageProps } from "../types/components";
import { MONTHS, calculateSessionStats, formatMinutes, groupSessionsByWeek } from "../utils/time";
import { ArrowLeft, Calendar, ChevronRight, Clock, Flame, TrendingUp } from "lucide-react";

export function HistoryPage({ onBack, onWeekSelect }: historyPageProps) {
    const [allSessions, setAllSessions] = useState<Session[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true)
                const data = await window.electron.sessions.getAll()

                const sessionsWithDates = (data || []).map((session: Session) => ({
                    ...session,
                    startTime: new Date(session.startTime),
                    createdAt: new Date(session.createdAt),
                }))

                setAllSessions(sessionsWithDates)
            } catch (error) {
                console.error('Erro ao buscar histórico:', error)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    const weeks = groupSessionsByWeek(allSessions)

    const isCurrentWeek = (weekStart: Date) => {
        const today = new Date()
        const currentSunday = new Date(today)
        currentSunday.setDate(today.getDate() - today.getDay())
        currentSunday.setHours(0, 0, 0, 0)
        return weekStart.toDateString() === currentSunday.toDateString()
    }

    const formatWeekRange = (start: Date, end: Date) => {
        const startStr = `${start.getDate()} ${MONTHS[start.getMonth()]}`
        const endStr = `${end.getDate()} ${MONTHS[end.getMonth()]}`
        return `${startStr} — ${endStr}`
    }

    return (
        <main className="flex-1 overflow-y-auto p-8">
            <div className="w-full max-w-screen-lg mx-auto flex flex-col gap-6">

                {/* Header */}
                <div className="flex items-start justify-between">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-sm text-muted-foreground
                                   hover:text-foreground transition-colors duration-200"
                    >
                        <ArrowLeft size={16} />
                        Voltar
                    </button>

                    <div className="text-right">
                        <h1 className="text-xl font-semibold text-foreground">Histórico</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Suas semanas de estudo
                        </p>
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <p className="text-sm text-muted-foreground">Carregando...</p>
                    </div>
                )}

                {/* Empty state */}
                {!loading && weeks.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 gap-2">
                        <p className="text-sm text-muted-foreground">
                            Nenhuma sessão registrada ainda.
                        </p>
                    </div>
                )}

                {/* Grid de semanas */}
                {!loading && weeks.length > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                        {weeks.map((week) => {
                            const stats = calculateSessionStats(week.sessions)
                            const isCurrent = isCurrentWeek(week.weekStart)

                            return (
                                <button
                                    key={week.weekStart.toISOString()}
                                    onClick={() => onWeekSelect(week)}
                                    className={`
                                        relative overflow-hidden text-left
                                        flex flex-col gap-4 p-5 rounded-2xl border
                                        transition-all duration-200
                                        hover:-translate-y-0.5
                                    `}
                                    style={{
                                        backdropFilter: 'blur(7.5px)',
                                        borderColor: isCurrent
                                            ? 'oklch(0.78 0.16 75 / 0.3)'
                                            : 'oklch(0.3 0.02 270)',
                                        backgroundColor: isCurrent
                                            ? 'oklch(0.78 0.16 75 / 0.05)'
                                            : 'oklch(0.21 0.025 270 / 0.6)',
                                        boxShadow: isCurrent
                                            ? '0 4px 24px -8px oklch(0.78 0.16 75 / 0.15)'
                                            : undefined
                                    }}
                                >
                                    {/* Top border luminosa */}
                                    <div
                                        className="absolute top-0 left-0 right-0 h-px"
                                        style={{ background: 'var(--gradient-primary)' }}
                                    />

                                    {/* Cabeçalho do card */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Calendar size={14} />
                                            <span className="text-sm">
                                                {formatWeekRange(week.weekStart, week.weekEnd)}
                                            </span>
                                        </div>

                                        {/* Badge atual */}
                                        {isCurrent && (
                                            <span className="text-[10px] font-semibold uppercase
                                                             tracking-widest px-2 py-1 rounded-full"
                                                style={{
                                                    backgroundColor: 'oklch(0.78 0.16 75 / 0.15)',
                                                    color: 'var(--primary)'
                                                }}
                                            >
                                                Atual
                                            </span>
                                        )}
                                    </div>

                                    {/* Métricas */}
                                    <div className="grid grid-cols-3 gap-4">
                                        {/* Total */}
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1">
                                                <Clock size={10} className="text-muted-foreground" />
                                                <span className="text-[10px] uppercase tracking-widest
                                                                 text-muted-foreground">
                                                    Total
                                                </span>
                                            </div>
                                            <span className="text-lg font-semibold font-mono
                                                             tabular-nums text-foreground">
                                                {formatMinutes(stats.totalMinutes)}
                                            </span>
                                        </div>

                                        {/* Sessões */}
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1">
                                                <Flame size={10} className="text-muted-foreground" />
                                                <span className="text-[10px] uppercase tracking-widest
                                                                 text-muted-foreground">
                                                    Sessões
                                                </span>
                                            </div>
                                            <span className="text-lg font-semibold font-mono
                                                             tabular-nums text-foreground">
                                                {stats.totalSessions}
                                            </span>
                                        </div>

                                        {/* Média */}
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1">
                                                <TrendingUp size={10} className="text-muted-foreground" />
                                                <span className="text-[10px] uppercase tracking-widest
                                                                 text-muted-foreground">
                                                    Média
                                                </span>
                                            </div>
                                            <span className="text-lg font-semibold font-mono
                                                             tabular-nums text-foreground">
                                                {formatMinutes(stats.averagePerDay)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Chevron */}
                                    <div className="absolute bottom-4 right-4
                                                    text-muted-foreground
                                                    group-hover:text-primary
                                                    transition-all duration-200">
                                        <ChevronRight size={16} />
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                )}
            </div>
        </main>
    )
}