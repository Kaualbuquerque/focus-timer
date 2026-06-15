import { Clock, Flame, TrendingUp } from "lucide-react"
import { Header } from "./components/Header"
import { StatCard } from "./components/StatCard"
import { Timer } from "./components/Timer"
import { TitleBar } from "./components/TitleBar"
import { HoursPerDay } from "./components/HoursPerDay"
import { SessionsList } from "./components/SessionsList"
import { TopGlow } from "./components/TopGlow"
import { useEffect, useState } from "react"
import { calculateSessionStats, formatMinutes } from "./utils/time"

function App() {
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadSessions = async () => {
    try {
      const data = await window.electron?.sessions.getAll()

      const sessionsWithDates = (data || []).map((session: any) => ({
        ...session,
        startTime: new Date(session.startTime),
        createdAt: new Date(session.createdAt),
      }))

      console.log('✅ Sessões atualizadas:', sessionsWithDates)
      setSessions(sessionsWithDates)
    } catch (error) {
      console.error('❌ Erro ao buscar sessões:', error)
    }
  }

  // Carrega sessões na inicialização
  useEffect(() => {
    const init = async () => {
      setLoading(true)
      await loadSessions()
      setLoading(false)
    }
    init()
  }, [])

  const stats = calculateSessionStats(sessions)


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
          <Timer onSessionSaved={loadSessions} />

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <StatCard
              icon={<Clock size={16} />}
              label="Total da semana"
              value={formatMinutes(stats.totalMinutes)}
            />
            <StatCard
              icon={<TrendingUp size={16} />}
              label="Média por dia ativo (0D)"
              value={formatMinutes(stats.averagePerDay)}
            />
            <StatCard
              icon={<Flame size={16} />}
              label={stats.totalSessions === 1 ? 'Sessão' : 'Sessões'}
              value={stats.totalSessions.toString()}
            />
          </div>

          {/* Graphic */}
          <HoursPerDay sessions={sessions} />

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