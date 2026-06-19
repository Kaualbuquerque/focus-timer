"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { contextBridge, ipcRenderer } = require("electron");
// Export APIs seguras para o Renderer
contextBridge.exposeInMainWorld('electron', {
    platform: process.platform,
    // Window controls
    minimizeWindow: () => ipcRenderer.send('window-minimize'),
    maximizeWindow: () => ipcRenderer.send('window-maximize'),
    closeWindow: () => ipcRenderer.send('window-close'),
    isWindowMaximized: () => ipcRenderer.invoke('is-window-maximized'),
    sessions: {
        getAll: () => ipcRenderer.invoke('sessions:getAll'),
        getWeek: () => ipcRenderer.invoke('sessions:getWeek'),
        getByDay: (dayOfWeek) => ipcRenderer.invoke('sessions:getByDay', dayOfWeek),
        create: (data) => ipcRenderer.invoke('sessions:create', data),
        delete: (id) => ipcRenderer.invoke('sessions:delete', id),
        update: (id, data) => ipcRenderer.invoke('sessions:update', id, data),
    },
});
