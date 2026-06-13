import { Minus, Square, X } from "lucide-react"
import { useEffect, useState } from "react"

declare global {
    interface Window {
        electron: {
            platform: string

            sessions: {
                getAll: () => Promise<any[]>
                getWeek: () => Promise<any[]>
                getByDay: (dayOfWeek: number) => Promise<any[]>
                create: (data: any) => Promise<any>
                delete: (id: string) => Promise<void>
                update: (id: string, data: any) => Promise<any>
            }

            minimizeWindow: () => void
            maximizeWindow: () => void
            closeWindow: () => void
            isWindowMaximized: () => Promise<boolean>
        }
    }
}

export function TitleBar() {
    const [isMaximized, setIsMaximized] = useState(false)

    useEffect(() => {
        // Verificar estado inicial
        window.electron.isWindowMaximized().then(setIsMaximized)

        // Escutar mudanças de maximização
        const interval = setInterval(() => {
            window.electron.isWindowMaximized().then(setIsMaximized)
        }, 500)

        return () => clearInterval(interval)
    }, [])

    const handleMaximize = async () => {
        window.electron.maximizeWindow()

        const maximized = await window.electron.isWindowMaximized()
        setIsMaximized(maximized)
    }

    return (
        <div className="title-bar" style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}>
            <div className="title-bar-left">
                {/* Space for logo */}
            </div>

            <div className="title-bar-right">
                {/* Minimize */}
                <button
                    onClick={() => window.electron.minimizeWindow()}
                    className="title-bar-button"
                    title="Minimizar"
                    style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
                >
                    <Minus size={16} />
                </button>


                {/* Maximize */}
                <button
                    onClick={handleMaximize}
                    className="title-bar-button"
                    title={isMaximized ? 'Restaurar' : 'Maximizar'}
                    style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
                >
                    <Square size={16} />
                </button>

                {/* To close */}
                <button
                    onClick={() => window.electron.closeWindow()}
                    className="title-bar-button title-bar-button-close"
                    title="Fechar"
                    style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    )
}