import * as path from 'path';
import * as url from 'url';
import { spawn } from 'child_process';
import { BrowserWindow, app, ipcMain, dialog } from 'electron';
import { Platform } from '_/types/platform';
import fs from 'fs';

const platform = () => {
  const pf = process.platform;
  if (pf === 'win32') {
    return process.arch === 'x64' ? Platform.Win64 : Platform.Win32;
  }
  if (pf === 'darwin') {
    return Platform.Darwin;
  }
  if (pf === 'linux') {
    return Platform.Linux;
  }
  throw dialog.showErrorBox('OS ERROR', `${pf} is not currently supported.`);
}

const dataPath = 
  process.env.NODE_ENV === 'development'
    ? path.join(__dirname, '../build-includes')
    : path.join(process.resourcesPath);

const corePath = () => {
  const pf = platform();
  let cPath: string;

  // Windows
  if (pf === Platform.Win32 || pf === Platform.Win64) {
    cPath = path.resolve(`${dataPath}/core/${platform()}/react-background-service.exe`);
    if (fs.existsSync(cPath)) return cPath;
    throw dialog.showErrorBox('CORE ERROR', 'core not found, fix core path in main.ts, row 34');
  }

  // OSX
  if (pf === Platform.Darwin) {
    cPath = path.resolve(`${dataPath}/core/OSX/react-background-service`);
    if (fs.existsSync(cPath)) return cPath;
    throw dialog.showErrorBox('CORE ERROR', 'core not found, fix core path in main.ts, row 41');
  }

  throw dialog.showErrorBox('OS ERROR', 'OS NOT SUPPORTED');
}

const coreProcess = spawn(corePath());


let mainWindow: Electron.BrowserWindow | null;

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    // maximizable: false,
    minimizable: true,
    // resizable: false,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      devTools: process.env.NODE_ENV !== 'production',
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, './index.html'),
      protocol: 'file:',
      slashes: true,
    }),
  ).finally(() => {});
  
  ipcMain.on('ping', (event, message: string) => {
    coreProcess.stdin.write(`${message}\n`);
  });

  // file dialog opener
  ipcMain.on('open-file-dialog-for-dir', async event => {
    const dir = await dialog.showOpenDialog({ properties: ['openFile'] });
    if (dir) {
      mainWindow?.webContents.send('selected-file', dir.filePaths[0]);
    }
  });

  coreProcess.stdout.on('data', (data: Buffer) => {
    mainWindow?.webContents.send('data-from-backend', data.toString());
  });


  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

app.on('before-quit', () => {
  coreProcess.kill();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it"s common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
