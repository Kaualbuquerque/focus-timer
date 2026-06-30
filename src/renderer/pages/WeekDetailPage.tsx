import { ArrowLeft, Calendar, Clock, Flame, TrendingUp } from "lucide-react";
import { WeekDatailPageProps } from "../types/components";
import { DAYS, MONTHS, calculateSessionStats, formatMinutes, formatTime, formatWeekRange, secondsToMinutes } from "../utils/time";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function WeekDatailPage({ week, onBack }: WeekDatailPageProps) {
    const stats = calculateSessionStats(week.sessions)

    const chartData = DAYS.map((day, index) => {
        const daySessions = week.sessions.filter(s => s.startTime.getDay() === index)
        const totalMinutes = daySessions.reduce((sum, s) => sum + secondsToMinutes(s.duration), 0)
        return { day, minutes: Math.round(totalMinutes) }
    })

    const CustomToolTip = ({ active, payload }: {
        active?: boolean; payload?: any[]
    }) => {
        if (active && payload && payload.length) {
            const totalMinutes = payload[0].value
            const hours = Math.floor(totalMinutes / 60)
            const minutes = Math.round(totalMinutes % 60)
            return (
                <div
                    className="rounded-xl p-3 text-sm border"
                    style={{
                        backgroundColor: 'oklch(0.21 0.025 270)',
                        borderColor: 'oklch(0.3 0.02 270)'
                    }}>
                    <span className="text-foreground font-mono">
                        {hours > 0 ? `${hours}h` : ''}{minutes > 0 ? ` ${minutes}min` : ''} · Estudo
                    </span>
                </div>
            )
        }

        return null
    }

    const sortedSessions = [...week.sessions].sort(
        (a, b) => b.startTime.getTime() - a.startTime.getTime()
    )

    return (
        <main className="flex-1 overflow-y-auto p-8">
            <div className="w-full max-w-screen-lg mx-auto flex flex-col gap-6">

                {/* Header */}
                <div className="flex flex-col gap-2">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 w-fit"
                    >
                        <ArrowLeft size={16} />
                        Histórico
                    </button>

                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                        <Calendar size={14} />
                        <span className="text-sm">
                            {formatWeekRange(week.weekStart, week.weekEnd)}
                        </span>
                    </div>

                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                        Resumo da semana
                    </h1>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    {[
                        {
                            icon: <Clock size={14} />,
                            label: 'Total',
                            value: formatMinutes(stats.totalMinutes)
                        },
                        {
                            icon: <Flame size={14} />,
                            label: 'Sessões',
                            value: stats.totalSessions.toString()
                        },
                        {
                            icon: <TrendingUp size={14} />,
                            label: `Média (${stats.daysActive}d)`,
                            value: formatMinutes(stats.averagePerDay)
                        },
                    ].map(({ icon, label, value }) => (
                        <div
                            key={label}
                            className="flex flex-col gap-2 p-4 rounded-2xl border"
                            style={{
                                backgroundColor: 'oklch(0.21 0.025 270 / 0.6)',
                                borderColor: 'oklch(0.3 0.02 270)',
                            }}
                        >
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                {icon}
                                <span className="text-[10px] uppercase tracking-widest">
                                    {label}
                                </span>
                            </div>
                            <span className="text-xl font-semibold font-mono tabular-nums text-foreground">
                                {value}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Graphic */}
                <div
                    className="flex flex-col gap-4 p-5 rounded-2xl border"
                    style={{
                        backgroundColor: 'oklch(0.21 0.025 270 / 0.6)',
                        borderColor: 'oklch(0.3 0.02 270)',
                    }}
                >
                    <span className="text-xs text-muted-foreground uppercase tracking-widest">
                        Horas por dia
                    </span>

                    <ResponsiveContainer width="100%" height={224}>
                        <BarChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="oklch(0.3 0.02 270)"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="day"
                                tick={{ fill: 'oklch(0.7 0.02 90)', fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fill: 'oklch(0.7 0.02 90)', fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                content={<CustomToolTip />}
                                cursor={{ fill: 'oklch(0.27 0.03 270 / 0.5)' }}
                            />
                            <Bar dataKey="minutes" radius={[6, 6, 0, 0]}>
                                {chartData.map((_, index) => (
                                    <Cell
                                        key={index}
                                        fill="oklch(0.78 0.16 75)"
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Session List */}
                <div
                    className="flex flex-col rounded-2xl border overflow-hidden"
                    style={{
                        backgroundColor: 'oklch(0.21 0.025 270 / 0.6)',
                        borderColor: 'oklch(0.3 0.02 270)',
                    }}
                >
                    {/* Title */}
                    <div
                        className="px-5 py-4 border-b"
                        style={{ borderColor: 'oklch(0.3 0.02 270 / 0.6)' }}
                    >
                        <span className="text-sm text-muted-foreground uppercase tracking-widest">
                            Sessões
                        </span>
                    </div>

                    {/* Lines */}
                    {sortedSessions.length === 0 ? (
                        <div className="px-5 py-8 text-center">
                            <p className="text-sm text-muted-foreground">
                                Nenhuma sessão nessa semana.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y" style={{ borderColor: 'oklch(0.3 0.02 270 / 0.6)' }}>
                            {sortedSessions.map(session => (
                                <div
                                    key={session.id}
                                    className="flex items-center justify-between px-5 py-3"
                                >
                                    <span className="text-sm text-muted-foreground">
                                        {DAYS[session.startTime.getDay()]}, {session.startTime.getDate()} {MONTHS[session.startTime.getMonth()]}
                                        {' · '}
                                        {formatTime(session.startTime)}
                                    </span>

                                    {/* Direita: duração */}
                                    <span className="text-sm font-semibold font-mono tabular-nums text-foreground">
                                        {formatMinutes(secondsToMinutes(session.duration))}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}