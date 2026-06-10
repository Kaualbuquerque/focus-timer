import { useEffect, useRef, useState } from "react"
import { TimerState } from "../types/components"

export function Timer() {
    const [totalSeconds, setTotalSeconds] = useState(0)
    const [isRunning, setIsRunning] = useState(false)
    const intervalRef = useRef<number | null>(null)

    // Formatar tempo para HH:MM:SS
    const formatTime = (secondsTotal: number): TimerState => {
        const hours = Math.floor(secondsTotal / 3600)
        const minutes = Math.floor((secondsTotal % 3600) / 60)
        const seconds = secondsTotal % 60

        return {
            hours: hours.toString().padStart(2, '0'),
            minutes: minutes.toString().padStart(2, '0'),
            seconds: seconds.toString().padStart(2, '0'),
        }
    }

    // Iniciar/Parar o intervalo
    useEffect(() => {
        if (isRunning) {
            intervalRef.current = window.setInterval(() => {
                setTotalSeconds(prev => prev + 1)
            }, 1000)
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
            }
        }

        // Cleanup
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [isRunning])

    const handleStart = () => {
        setIsRunning(true)
    }

    const handlePause = () => {
        setIsRunning(false)
    }

    const handleReset = () => {
        setIsRunning(false)
        setTotalSeconds(0)
    }

    const time = formatTime(totalSeconds)


    return (
        <div className="card mb-8">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-sm uppercase tracking-wider text-gray-400 mb-4">
                    {isRunning ? 'Esturando...' : 'Pronto para estudar'}
                </h2>

                {/* Timer Displey */}
                <div className="timer-display flex items-center justify-center gap-2">
                    <span>{time.hours}</span>
                    <span className="text-gray-600">:</span>
                    <span>{time.minutes}</span>
                    <span className="text-gray-600">:</span>
                    <span>{time.seconds}</span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
                {isRunning ? (
                    <button onClick={handlePause} className="btn-primary">
                        ⏸ Pausar
                    </button>
                ) : (
                    <button onClick={handleStart} className="btn-primary">
                        ▶ Iniciar
                    </button>
                )}

                <button onClick={handleReset} className="btn-secondary">
                    🔄 Zerar
                </button>
            </div>
        </div>
    )
}