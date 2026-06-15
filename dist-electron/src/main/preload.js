"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// Export APIs seguras para o Renderer
electron_1.contextBridge.exposeInMainWorld('electron', {
    platform: process.platform,
    // Window controls
    minimizeWindow: () => electron_1.ipcRenderer.send('window-minimize'),
    maximizeWindow: () => electron_1.ipcRenderer.send('window-maximize'),
    closeWindow: () => electron_1.ipcRenderer.send('window-close'),
    isWindowMaximized: () => electron_1.ipcRenderer.invoke('is-window-maximized'),
    sessions: {
        getAll: () => electron_1.ipcRenderer.invoke('sessions:getAll'),
        getWeek: () => electron_1.ipcRenderer.invoke('sessions:getWeek'),
        getByDay: (dayOfWeek) => electron_1.ipcRenderer.invoke('sessions:getByDay', dayOfWeek),
        create: (data) => electron_1.ipcRenderer.invoke('sessions:create', data),
        delete: (id) => electron_1.ipcRenderer.invoke('sessions:delete', id),
        update: (id, data) => electron_1.ipcRenderer.invoke('sessions:update', id, data),
    },
});
