import { Clock, Flame, TrendingUp } from "lucide-react"
import { Header } from "./components/Header"
import { StatCard } from "./components/StatCard"
import { Timer } from "./components/Timer"
import { TitleBar } from "./components/TitleBar"

function App() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
        {/* ✨ NOVO: TitleBar no topo */}
        <TitleBar />
  
        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
          <div className="w-full max-w-2xl">
            {/* Header (data, title) */}
            <Header />
  
            {/* Timer Section */}
            <Timer />
  
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mt-8">
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
            <div className="mt-8 mb-8">
              <div className="card h-64 flex items-center justify-center text-muted-foreground">
                Gráfico aqui (próximo)
              </div>
            </div>
          </div>
        </main>
      </div>
    )
}

export default App