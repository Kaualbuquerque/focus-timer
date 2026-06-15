import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { HoursPerDayProps } from '../types/components'
import { DAYS, calculateHoursByDay } from '../utils/time'

export function HoursPerDay({ sessions = [] }: HoursPerDayProps) {

  const data = calculateHoursByDay(sessions)
  const today = new Date().getDay()

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean
    payload?: Array<{ value: number }>
  }) => {
    if (active && payload && payload.length) {
      const totalMinutes = payload[0].value
      const hours = Math.floor(totalMinutes / 60)
      const minutes = Math.round(totalMinutes % 60)
      return (
        <div className="bg-card border border-border rounded-xl p-2 text-sm text-foreground">
          {hours}h {minutes}m
        </div>
      )
    }
    return null
  }

  //Custom shape
  const CustomBar = (props: any) => {
    const { x, y, width, height, payload } = props
    const dayIndex = DAYS.indexOf(payload.day)
    const isTodayBar = dayIndex === today
    const barColor = isTodayBar ? 'var(--primary)' : 'oklch(0.5 0.08 75)'

    return <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={barColor}
      rx={8}
      ry={8} />
  }

  return (
    <div className="card mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Horas por dia</h2>
        <span className="text-sm text-muted-foreground">Semana atual</span>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border)"
            vertical={false}
          />

          <XAxis
            dataKey="day"
            stroke="var(--muted-foreground)"
            style={{ fontSize: '12px' }}
            tick={{ fill: 'var(--muted-foreground)' }}
          />

          <YAxis
            stroke="var(--muted-foreground)"
            style={{ fontSize: '12px' }}
            tick={{ fill: 'var(--muted-foreground)' }}
            label={{ value: 'Minutos', angle: -90, position: 'insideLeft' }}
          />

          <Tooltip content={<CustomTooltip />} />

          <Bar
            dataKey="minutes"
            shape={<CustomBar />}
            radius={[8, 8, 0, 0]}
            isAnimationActive={true}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}