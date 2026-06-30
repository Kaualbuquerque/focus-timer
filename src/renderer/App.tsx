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
import { Page, Session, WeekData } from "./types/components"
import { HistoryPage } from "./pages/HistoryPage"
import { WeekDatailPage } from "./pages/WeekDetailPage"


function App() {
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [currentPage, setCurrentPage] = useState<Page>('home')
  const [selectedWeek, setSelectedWeek] = useState<WeekData | null>(null)

  const loadSessions = async () => {
    try {
      const data = await window.electron?.sessions.getWeek()

      const sessionsWithDates = (data || []).map((session: Session) => ({
        ...session,
        startTime: new Date(session.startTime),
        createdAt: new Date(session.createdAt),
      }))

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

  const handleWeekSelect = (week: WeekData) => {
    setSelectedWeek(week)
    setCurrentPage('week-detail')
  }

  const renderPage = () => {
    if (currentPage === 'history') {
      return (
        <p>
          <HistoryPage
            onBack={() => setCurrentPage('home')}
            onWeekSelect={handleWeekSelect}
          />
        </p>
      )
    }

    if (currentPage === 'week-detail') {
      return (<p>
        <WeekDatailPage
          week={selectedWeek!}
          onBack={() => setCurrentPage('history')}
        />
      </p>)
    }

    return (
      < main className="flex-1 flex items-center justify-center p-8 overflow-y-auto" >
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
              label="Média por dia ativo"
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
      </main >
    )
  }

  const stats = calculateSessionStats(sessions)


  return (
    <div className="min-h-screen flex flex-col">
      <TopGlow />

      {/* TitleBar */}
      <TitleBar
        onHistoryClick={() => setCurrentPage('history')}
        currentPage={currentPage}
      />

      {renderPage()}
    </div>
  )
}

export default App