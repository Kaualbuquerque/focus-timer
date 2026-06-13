import { Clock, Flame, TrendingUp } from "lucide-react"
import { Header } from "./components/Header"
import { StatCard } from "./components/StatCard"
import { Timer } from "./components/Timer"
import { TitleBar } from "./components/TitleBar"
import { HoursPerDay } from "./components/HoursPerDay"
import { SessionsList } from "./components/SessionsList"
import { TopGlow } from "./components/TopGlow"

function App() {

  const mockSessions = [
    {
      id: '1',
      dayOfWeek: 1, // Seg
      startTime: new Date(2024, 5, 10, 10, 0),
      duration: 2700, // 45 min
      completed: true,
    },
    {
      id: '2',
      dayOfWeek: 1, // Seg
      startTime: new Date(2024, 5, 10, 14, 30),
      duration: 6300, // 1h 45min
      completed: true,
    },
    {
      id: '3',
      dayOfWeek: 2, // Ter
      startTime: new Date(2024, 5, 11, 9, 30),
      duration: 4500, // 1h 15min
      completed: true,
    },
    {
      id: '4',
      dayOfWeek: 5, // Ter
      startTime: new Date(2026, 6, 12, 10, 35),
      duration: 7500, // 1h 15min
      completed: true,
    }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <TopGlow />

      {/* TitleBar */}
      <TitleBar />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-screen-lg flex flex-col gap-4">
          {/* Header */}
          <Header />

          {/* Timer Section */}
          <Timer />

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <StatCard
              icon={<Clock size={16} />}
              label="Total da semana"
              value="0min"
            />
            <StatCard
              icon={<TrendingUp size={16} />}
              label="Média por dia ativo (0D)"
              value="0min"
            />
            <StatCard
              icon={<Flame size={16} />}
              label="Sessões"
              value="0"
            />
          </div>

          {/* Graphic */}
          <HoursPerDay />

          {/* Sessions */}
          <SessionsList
            sessions={mockSessions}
            isLoading={false}
            onDelete={(id) => console.log('Deletar:', id)}
          />
        </div>
      </main>
    </div>
  )
}

export default App