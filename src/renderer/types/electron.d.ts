export { }

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