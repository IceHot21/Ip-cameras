import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'

contextBridge.exposeInMainWorld('ipc', {
  closeWindow: () => ipcRenderer.send('window:close'),
})