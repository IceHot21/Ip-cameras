import path from 'path'
import { app, BrowserWindow, ipcMain, screen } from 'electron' // Импортируем модуль screen
import serve from 'electron-serve'
import { createWindow } from './helpers'

const isProd = process.env.NODE_ENV === 'production'

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}


;(async () => {
  await app.whenReady()

  const mainWindow = createWindow('main', {
    title: "IP Cameras",
    width: 1920,
    height: 1080,
    autoHideMenuBar: true,
    frame: false,
    titleBarStyle: "hidden",
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  mainWindow.center() // Центрирует окно на экране

  if (isProd) {
    await mainWindow.loadURL('app://./LoginPage/LoginPage')
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/LoginPage/LoginPage`)
    // mainWindow.webContents.openDevTools()
  }
})()

app.on('window-all-closed', () => {
  app.quit()
})

app.on('ready', () => {
  app.commandLine.appendSwitch('ignore-certificate-errors', 'true')
})

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`)
})

ipcMain.on('window:minimize', (event) => {
  const window = BrowserWindow.getFocusedWindow()
  if (window) window.minimize()
})

ipcMain.on('window:maximize', (event) => {
  const window = BrowserWindow.getFocusedWindow()
  if (window) {
    if (window.isMaximized()) {
      window.unmaximize()
    } else {
      window.maximize()
    }
  }
})

ipcMain.on('window:close', (event) => {
  const window = BrowserWindow.getFocusedWindow()
  if (window) window.close()
})