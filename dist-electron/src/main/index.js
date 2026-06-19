"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = !app.isPackaged;
function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        minWidth: 800,
        minHeight: 500,
        backgroundColor: '#0f0f0f',
        icon: isDev ? path.join(__dirname, '../../../assets/icon.png')
            : path.join(process.resourcesPath, 'assets/icon.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
        frame: false,
        titleBarStyle: 'hiddenInset',
    });
    if (isDev) {
        mainWindow.loadURL('http://localhost:5173');
    }
    else {
        mainWindow.loadFile(path.join(__dirname, '../../../dist/index.html'));
    }
    ipcMain.on('window-minimize', () => mainWindow?.minimize());
    ipcMain.on('window-maximize', () => {
        if (mainWindow?.isMaximized())
            mainWindow.unmaximize();
        else
            mainWindow?.maximize();
    });
    ipcMain.on('window-close', () => mainWindow?.close());
    ipcMain.handle('is-window-maximized', () => {
        return mainWindow?.isMaximized() || false;
    });
}
async function setupDatabase(prisma) {
    try {
        await prisma.$connect();
        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS "Session" (
                "id" TEXT NOT NULL PRIMARY KEY,
                "dayOfWeek" INTEGER NOT NULL,
                "startTime" DATETIME NOT NULL,
                "duration" INTEGER NOT NULL,
                "completed" BOOLEAN NOT NULL DEFAULT true,
                "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        `);
        await prisma.$executeRawUnsafe(`
            CREATE INDEX IF NOT EXISTS "Session_dayOfWeek_idx"
            ON "Session"("dayOfWeek")
        `);
        console.log('✅ Banco de dados inicializado!');
    }
    catch (error) {
        console.error('❌ Erro ao inicializar banco:', error);
        throw error;
    }
}
app.whenReady().then(async () => {
    if (!process.env.DATABASE_URL) {
        const dbPath = path.join(app.getPath('userData'), 'focus-timer.db');
        process.env.DATABASE_URL = `file:${dbPath}`;
        console.log('✅ DATABASE_URL:', process.env.DATABASE_URL);
    }
    const prisma = require('./prisma.js');
    const { sessionService } = require('./services/sessionService.js');
    await setupDatabase(prisma);
    // Get all sessions from database
    ipcMain.handle('sessions:getAll', async () => {
        try {
            return await sessionService.getAllSessions();
        }
        catch (error) {
            console.error('Erro ao buscar sessões:', error);
            throw error;
        }
    });
    // Get sessions from current week
    ipcMain.handle('sessions:getWeek', async () => {
        try {
            return await sessionService.getWeekSessions();
        }
        catch (error) {
            console.error('Erro ao buscar sessões da semana:', error);
            throw error;
        }
    });
    // Get sessions for a specific day of week
    ipcMain.handle('sessions:getByDay', async (_event, dayOfWeek) => {
        try {
            return await sessionService.getSessionsByDay(dayOfWeek);
        }
        catch (error) {
            console.error('Erro ao buscar sessões do dia:', error);
            throw error;
        }
    });
    // Create a new session
    ipcMain.handle('sessions:create', async (_event, data) => {
        try {
            return await sessionService.createSession(data);
        }
        catch (error) {
            console.error('Erro ao criar sessão:', error);
            throw error;
        }
    });
    // Delete a session by ID
    ipcMain.handle('sessions:delete', async (_event, id) => {
        try {
            return await sessionService.deleteSession(id);
        }
        catch (error) {
            console.error('Erro ao deletar sessão:', error);
            throw error;
        }
    });
    // Update a session by ID
    ipcMain.handle('sessions:update', async (_event, id, data) => {
        try {
            return await sessionService.updateSession(id, data);
        }
        catch (error) {
            console.error('Erro ao atualizar sessão:', error);
            throw error;
        }
    });
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
