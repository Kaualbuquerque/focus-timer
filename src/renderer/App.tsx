import { Clock, Flame, TrendingUp } from "lucide-react"
import { Header } from "./components/Header"
import { StatCard } from "./components/StatCard"
import { Timer } from "./components/Timer"
import { TitleBar } from "./components/TitleBar"
import { HoursPerDay } from "./components/HoursPerDay"

function App() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* TitleBar */}
      <TitleBar />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-2xl flex flex-col gap-4">
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

          {/* Placeholder */}
          <HoursPerDay />
        </div>
      </main>
    </div>
  )
}

export default App