import { contextBridge, ipcRenderer } from "electron"
// Export APIs seguras para o Renderer
contextBridge.exposeInMainWorld('electron', {
  platform: process.platform,
  //saveSession: (data) => ipcRenderer.invoke('save-session', data), // ← Vamos fazer isso depois

  // Window controls
  minimizeWindow: () => ipcRenderer.send('window-minimize'),
  maximizeWindow: () => ipcRenderer.send('window-maximize'),
  closeWindow: () => ipcRenderer.send('window-close'),
  isWindowMaximized: () => ipcRenderer.invoke('is-window-maximized'),
})
