import { Clock, Flame, TrendingUp } from "lucide-react"
import { Header } from "./components/Header"
import { StatCard } from "./components/StatCard"
import { Timer } from "./components/Timer"
import { TitleBar } from "./components/TitleBar"
import { HoursPerDay } from "./components/HoursPerDay"
import { SessionsList } from "./components/SessionsList"
import { TopGlow } from "./components/TopGlow"
import { useEffect, useState } from "react"

function App() {
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSessions = async () => {
      try {
        setLoading(true)
        const data = await window.electron?.sessions.getAll()
        console.log('✅ Sessões do banco:', data)
        setSessions(data || [])
      } catch (error) {
        console.error('❌ Erro ao buscar sessões:', error)
      } finally {
        setLoading(false)
      }
    }
    loadSessions()
  }, [])

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
            sessions={sessions}
            isLoading={loading}
            onDelete={(id) => {
              window.electron?.sessions.delete(id)
              setSessions(sessions.filter(s => s.id !== id))
            }}
          />
        </div>
      </main>
    </div>
  )
}

export default App