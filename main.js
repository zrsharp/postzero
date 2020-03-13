const { app, BrowserWindow, Menu, Tray } = require('electron');
const path = require('path');

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1220,
        height: 720,
        icon: './img/icon.ico',
        title: app.getName,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true
        }
    });

    createTray(mainWindow);

    // and load the index.html of the app.
    mainWindow.loadFile('index.html');

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
}

function createMenu() {
    var template = [
        {
            label: '文件',
            submenu: [
                {
                    label: '打开',
                    accelerator: 'CmdOrCtrl+O',
                    role: 'open'
                },
                {
                    label: '保存',
                    accelerator: 'CmdOrCtrl+S   ',
                    role: 'save'
                },
                {
                    type: 'separator'
                },
                {
                    label: '退出',
                    accelerator: 'CmdOrCtrl+Q',
                    role: 'close'
                }
            ]
        },
        {
            label: '编辑',
            submenu: [
                {
                    label: '撤销',
                    accelerator: 'CmdOrCtrl+Z',
                    role: 'undo'
                },
                {
                    label: '恢复',
                    accelerator: 'Shift+CmdOrCtrl+Z',
                    role: 'redo'
                },
                {
                    type: 'separator'
                },
                {
                    label: '剪切',
                    accelerator: 'CmdOrCtrl+X',
                    role: 'cut'
                },
                {
                    label: '复制',
                    accelerator: 'CmdOrCtrl+C',
                    role: 'copy'
                },
                {
                    label: '粘贴',
                    accelerator: 'CmdOrCtrl+V',
                    role: 'paste'
                },
                {
                    label: '全选',
                    accelerator: 'CmdOrCtrl+A',
                    role: 'selectall'
                },
            ]
        },
        {
            label: '视图',
            submenu: [
                {
                    label: '重新加载窗口',
                    accelerator: 'CmdOrCtrl+R',
                    click: function (item, focusedWindow) {
                        if (focusedWindow)
                            focusedWindow.reload();
                    }
                },
                {
                    label: '全屏',
                    accelerator: (function () {
                        if (process.platform == 'darwin')
                            return 'Ctrl+Command+F';
                        else
                            return 'F11';
                    })(),
                    click: function (item, focusedWindow) {
                        if (focusedWindow)
                            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
                    }
                },

            ]
        },
        {
            label: '窗口',
            role: 'window',
            submenu: [
                {
                    label: '最小化',
                    accelerator: 'CmdOrCtrl+M',
                    role: 'minimize'
                },
                {
                    label: '最大化',
                    accelerator: 'Alt+CmdOrCtrl+M',
                    click: function (item, focusedWindow) {
                        if (focusedWindow.isMaximized())
                            focusedWindow.restore();
                        else
                            focusedWindow.maximize();
                    }
                }
            ]
        },
        {
            label: '帮助',
            role: 'help',
            submenu: [
                {
                    label: '关于',
                    click: function () {
                        require('electron').shell.openExternal('https://me.csdn.net/Zero__White')
                    }
                }
            ]
        },
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

function createTray(mainWindow) {
    //创建任务栏图标、菜单
    const tray = new Tray(path.join(__dirname, './img/logo.png'));
    const trayContextMenu = Menu.buildFromTemplate([
        {
            label: '显示/隐藏',
            click: function () {
                return mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
            }
        },
        {
            label: '退出',
            click: function () {
                app.quit();
            }
        }
    ]);

    tray.setToolTip(app.getName());

    tray.setContextMenu(trayContextMenu);

    tray.on('click', function () {
        mainWindow.show();
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function () {
    createMenu();
    createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin')
        app.quit();
});

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0)
        createWindow();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
