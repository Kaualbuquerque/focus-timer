import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
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
        minHeight: 600,
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
