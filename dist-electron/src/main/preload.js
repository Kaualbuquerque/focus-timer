"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// Export APIs seguras para o Renderer
electron_1.contextBridge.exposeInMainWorld('electron', {
    platform: process.platform,
    //saveSession: (data) => ipcRenderer.invoke('save-session', data), // ← Vamos fazer isso depois
    // Window controls
    minimizeWindow: () => electron_1.ipcRenderer.send('window-minimize'),
    maximizeWindow: () => electron_1.ipcRenderer.send('window-maximize'),
    closeWindow: () => electron_1.ipcRenderer.send('window-close'),
    isWindowMaximized: () => electron_1.ipcRenderer.invoke('is-window-maximized'),
});
