import path from 'path'
import { app, ipcMain } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'
import { exec } from 'child_process';

const isProd = process.env.NODE_ENV === 'production'

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

const startServer = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const serverPath = path.join('C:/Users/AT/Documents/GitHub/Ip_cameras_refact/Nextron-nest-app-start-config/my-app');
    const serverCommand = 'npm run start:prod'; // или 'node server.js'

    const serverProcess = exec(serverCommand, { cwd: serverPath });

    console.log('Starting server...');

    serverProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
      resolve();
    });

    serverProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
      reject(data);
    });

    serverProcess.on('close', (code) => {
      console.log(`Server process exited with code ${code}`);
    });
  });
};

;(async () => {
  await app.whenReady()

  if (isProd) {
    await startServer();
  }

  const mainWindow = createWindow('main', {
    title: "ТД-ЭЛ Сервер",
    width: 1920,
    height: 1080,
    autoHideMenuBar: true,      // Скрываем меню окна
    frame: false,
    titleBarStyle: "hidden",
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  if (isProd) {
    await mainWindow.loadURL('app://./LoginPage/LoginPage')
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/LoginPage/LoginPage`)
    mainWindow.webContents.openDevTools()
  }
})()

app.on('window-all-closed', () => {
  app.quit()
})

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`)
})
