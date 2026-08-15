const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let nextProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 600,
    backgroundColor: '#141414',
    icon: path.join(__dirname, 'public/icon-256.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
    },
    show: false,
  });

  // Wait for Next.js to be ready, then load the app
  setTimeout(() => {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.show();
  }, 5000);

  // Create application menu
  const menuTemplate = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Refresh',
          accelerator: 'CmdOrCtrl+R',
          click: () => mainWindow.reload(),
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'F12',
          click: () => mainWindow.webContents.toggleDevTools(),
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: 'Alt+F4',
          click: () => app.quit(),
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Zoom In',
          accelerator: 'CmdOrCtrl+Plus',
          click: () => {
            const zoom = mainWindow.webContents.getZoomLevel();
            mainWindow.webContents.setZoomLevel(zoom + 0.5);
          },
        },
        {
          label: 'Zoom Out',
          accelerator: 'CmdOrCtrl+-',
          click: () => {
            const zoom = mainWindow.webContents.getZoomLevel();
            mainWindow.webContents.setZoomLevel(zoom - 0.5);
          },
        },
        {
          label: 'Reset Zoom',
          accelerator: 'CmdOrCtrl+0',
          click: () => mainWindow.webContents.setZoomLevel(0),
        },
        { type: 'separator' },
        {
          label: 'Toggle Full Screen',
          accelerator: 'F11',
          click: () => mainWindow.setFullScreen(!mainWindow.isFullScreen()),
        },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About StreamHub',
          click: () => {
            const { dialog } = require('electron');
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About StreamHub',
              message: 'StreamHub v1.0.0',
              detail: 'Watch Movies & TV Shows with Friends\n\nBuilt with Next.js, React & Electron',
              buttons: ['OK'],
            });
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function startNextServer() {
  console.log('Starting Next.js server...');
  
  // Check if we're in development or production
  const isDev = process.env.NODE_ENV !== 'production';
  
  if (isDev) {
    nextProcess = spawn('npm', ['run', 'dev'], {
      cwd: __dirname,
      shell: true,
      stdio: 'inherit',
    });
  } else {
    nextProcess = spawn('npm', ['start'], {
      cwd: __dirname,
      shell: true,
      stdio: 'inherit',
    });
  }

  nextProcess.on('error', (err) => {
    console.error('Failed to start Next.js:', err);
  });
}

// App lifecycle
app.whenReady().then(() => {
  startNextServer();
  createWindow();
});

app.on('window-all-closed', () => {
  if (nextProcess) {
    nextProcess.kill();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  if (nextProcess) {
    nextProcess.kill();
  }
  app.quit();
});

process.on('SIGTERM', () => {
  if (nextProcess) {
    nextProcess.kill();
  }
  app.quit();
});
