import { useEffect, useRef, useState } from "react"
import { Pause, Play, RefreshCcw } from "lucide-react"
import { formatTimeDisplay } from "../utils/time"

export function Timer({ onSessionSaved }: { onSessionSaved?: () => void }) {
    const [totalSeconds, setTotalSeconds] = useState(0)
    const [isRunning, setIsRunning] = useState(false)
    const intervalRef = useRef<number | null>(null)
    const startTimestampRef = useRef<number | null>(null)
    const accumulatedSecondsRef = useRef(0)

    // Iniciar/Parar o intervalo
    useEffect(() => {
        if (isRunning) {
            // It marks the exact moment when counting began.
            startTimestampRef.current = Date.now()

            intervalRef.current = window.setInterval(() => {
                // It calculates based on actual elapsed time.
                const elapsedSinceStart = Math.floor(
                    (Date.now() - startTimestampRef.current!) / 1000
                )
                setTotalSeconds(accumulatedSecondsRef.current + elapsedSinceStart)
            }, 1000)
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
            }

            // When paused, the elapsed time is added to the accumulated time.
            if (startTimestampRef.current) {
                const elapsedSinceStart = Math.floor(
                    (Date.now() - startTimestampRef.current) / 1000
                )
                accumulatedSecondsRef.current += elapsedSinceStart
                startTimestampRef.current = null
            }
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [isRunning])

    const handleStart = () => setIsRunning(true)


    const handlePause = () => setIsRunning(false)


    const handleReset = async () => {
        setIsRunning(false)

        if (totalSeconds > 0) {
            try {
                await window.electron?.sessions.create({
                    dayOfWeek: new Date().getDay(),
                    startTime: new Date(Date.now() - totalSeconds * 1000),
                    duration: totalSeconds,
                })
                onSessionSaved?.()
            } catch (error) {
                console.error('Erro ao salvar sessão:', error)
            }
        }

        setTotalSeconds(0)
        accumulatedSecondsRef.current = 0
        startTimestampRef.current = null
    }

    const time = formatTimeDisplay(totalSeconds)


    return (
        <div className="flex flex-col justify-center">

            <div className="card-timer mb-8">
                <div className="text-center mb-8">
                    <h2 className="text-xs uppercase tracking-wider text-gray-400 mb-4">
                        {isRunning ? 'Estudando...' : 'Pronto para estudar'}
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
                            <Pause /> Pausar
                        </button>
                    ) : (
                        <button onClick={handleStart} className="btn-primary">
                            <Play /> Iniciar
                        </button>
                    )}
                    <button onClick={handleReset} className="btn-secondary">
                        <RefreshCcw /> Zerar
                    </button>
                </div>
            </div>
        </div>
    )
}