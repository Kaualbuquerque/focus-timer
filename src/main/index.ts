import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import { sessionService } from './services/sessionService'

// Create __dirname manually 
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Detect if it is under development.
const isDev = !app.isPackaged

function createWindow() {
    // Create the browser window
    const mainWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        minWidth: 800,
        minHeight: 500,
        backgroundColor: '#0f0f0f',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },

        frame: false,
        titleBarStyle: 'hiddenInset',
    })

    // Load the application
    if (isDev) {
        mainWindow.loadURL('http://localhost:5173')
    } else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
    }

    // Handlers for IPC (communication with the Renderer)
    ipcMain.on('window-minimize', () => {
        mainWindow?.minimize()
    })

    ipcMain.on('window-maximize', () => {
        if (mainWindow?.isMaximized()) {
            mainWindow.unmaximize()
        } else {
            mainWindow?.maximize()
        }
    })

    ipcMain.on('window-close', () => {
        mainWindow?.close()
    })

    // Track window status
    ipcMain.handle('is-window-maximized', () => {
        return mainWindow?.isMaximized() || false
    })
}

// Get all sessions from database
ipcMain.handle('sessions:getAll', async () => {
    try {
        return await sessionService.getAllSessions()
    } catch (error) {
        console.error('Erro ao buscar sessões:', error)
        throw error
    }
})

// Get sessions from current week
ipcMain.handle('sessions:getWeek', async () => {
    try {
        return await sessionService.getWeekSessions()
    } catch (error) {
        console.error('Erro ao buscar sessões da semana:', error)
        throw error
    }
})

// Get sessions for a specific day of week
ipcMain.handle('sessions:getByDay', async (_event, dayOfWeek: number) => {
    try {
        return await sessionService.getSessionsByDay(dayOfWeek)
    } catch (error) {
        console.error('Erro ao buscar sessões do dia:', error)
        throw error
    }
})

// Create a new session
ipcMain.handle('sessions:create', async (_event, data: {
    dayOfWeek: number
    startTime: Date
    duration: number
}) => {
    try {
        return await sessionService.createSession(data)
    } catch (error) {
        console.error('Erro ao criar sessão:', error)
        throw error
    }
})

// Delete a session by ID
ipcMain.handle('sessions:delete', async (_event, id: string) => {
    try {
        return await sessionService.deleteSession(id)
    } catch (error) {
        console.error('Erro ao deletar sessão:', error)
        throw error
    }
})

// Update a session by ID
ipcMain.handle('sessions:update', async (_event, id: string, data: any) => {
    try {
        return await sessionService.updateSession(id, data)
    } catch (error) {
        console.error('Erro ao atualizar sessão:', error)
        throw error
    }
})

// When Electron finishes initializing
app.whenReady().then(() => {
    createWindow()

    // On macOS, recreate window when clicking on the dock.
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

// Close the app when all windows are closed (except macOS).
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})