import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
  } from 'recharts'
  
  // Day data
  const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  
  const data = [
    { day: 'Dom', hours: 0 },
    { day: 'Seg', hours: 1.5 },
    { day: 'Ter', hours: 2.5 },
    { day: 'Qua', hours: 3 },
    { day: 'Qui', hours: 2 },
    { day: 'Sex', hours: 2.5 },
    { day: 'Sáb', hours: 1 },
  ]
  
  // Auxiliary function to retrieve the daily index.
  const getDayIndex = (dayName: string): number => {
    return DAYS.indexOf(dayName)
  }
  
  // Function to find out if it's today.
  const isToday = (dayIndex: number, today: number): boolean => {
    return dayIndex === today
  }
  
  export function HoursPerDay() {
    const today = new Date().getDay()
  
    const CustomTooltip = ({
      active,
      payload,
    }: {
      active?: boolean
      payload?: Array<{ value: number }>
    }) => {
      if (active && payload && payload.length) {
        const value = payload[0].value
        const hours = Math.floor(value)
        const minutes = Math.round((value - hours) * 60)
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
      const dayIndex = getDayIndex(payload.day)
      const isTodayBar = isToday(dayIndex, today)
  
      const barColor = isTodayBar 
        ? 'var(--primary)' 
        : 'oklch(0.5 0.08 75)'
  
      return (
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={barColor}
          rx={8}
          ry={8}
        />
      )
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
              label={{ value: 'Horas', angle: -90, position: 'insideLeft' }}
            />
  
            <Tooltip content={<CustomTooltip />} />
  
            <Bar
              dataKey="hours"
              shape={<CustomBar />}
              radius={[8, 8, 0, 0]}
              isAnimationActive={true}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }