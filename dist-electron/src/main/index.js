import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { sessionService } from './services/sessionService.js';
// Criar __dirname manualmente (ES Modules não tem isso)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Detectar se está em desenvolvimento
const isDev = !app.isPackaged;
function createWindow() {
    // Criar a janela do navegador
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
    });
    // Carregar a aplicação
    if (isDev) {
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    }
    else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }
    // Handlers para IPC(comunicação com Renderer)
    ipcMain.on('window-minimize', () => {
        mainWindow?.minimize();
    });
    ipcMain.on('window-maximize', () => {
        if (mainWindow?.isMaximized()) {
            mainWindow.unmaximize();
        }
        else {
            mainWindow?.maximize();
        }
    });
    ipcMain.on('window-close', () => {
        mainWindow?.close();
    });
    // Rastrear estado da janela
    ipcMain.handle('is-window-maximized', () => {
        return mainWindow?.isMaximized() || false;
    });
}
app.whenReady().then(async () => {
    // FOR TESTS
    try {
        await sessionService.deleteAllSessions();
        await sessionService.createSession({
            dayOfWeek: 1, // Seg
            startTime: new Date(2024, 5, 10, 10, 0),
            duration: 2700, // 45 min
        });
        await sessionService.createSession({
            dayOfWeek: 1,
            startTime: new Date(2024, 5, 10, 14, 30),
            duration: 6300, // 1h 45min
        });
        await sessionService.createSession({
            dayOfWeek: 2, // Ter
            startTime: new Date(2024, 5, 11, 9, 30),
            duration: 4500, // 1h 15min
        });
        const sessions = await sessionService.getAllSessions();
        console.log('Sessões no banco:', sessions);
    }
    catch (error) {
        console.error('Erro ao testar banco:', error);
    }
});
ipcMain.handle('sessions:getAll', async () => {
    try {
        return await sessionService.getAllSessions();
    }
    catch (error) {
        console.error('Erro ao buscar sessões:', error);
        throw error;
    }
});
ipcMain.handle('sessions:getWeek', async () => {
    try {
        return await sessionService.getWeekSessions();
    }
    catch (error) {
        console.error('Erro ao buscar sessões da semana:', error);
        throw error;
    }
});
ipcMain.handle('sessions:getByDay', async (_event, dayOfWeek) => {
    try {
        return await sessionService.getSessionsByDay(dayOfWeek);
    }
    catch (error) {
        console.error('Erro ao buscar sessões do dia:', error);
        throw error;
    }
});
ipcMain.handle('sessions:create', async (_event, data) => {
    try {
        return await sessionService.createSession(data);
    }
    catch (error) {
        console.error('Erro ao criar sessão:', error);
        throw error;
    }
});
ipcMain.handle('sessions:delete', async (_event, id) => {
    try {
        return await sessionService.deleteSession(id);
    }
    catch (error) {
        console.error('Erro ao deletar sessão:', error);
        throw error;
    }
});
ipcMain.handle('sessions:update', async (_event, id, data) => {
    try {
        return await sessionService.updateSession(id, data);
    }
    catch (error) {
        console.error('Erro ao atualizar sessão:', error);
        throw error;
    }
});
// Quando o Electron terminar de inicializar
app.whenReady().then(() => {
    createWindow();
    // No macOS, recriar janela quando clicar no dock
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
// Fechar o app quando todas as janelas forem fechadas (exceto macOS)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
