const electron = require('electron')
const app = electron.app
const session = electron.session
const BrowserWindow = electron.BrowserWindow
const ipcMain = electron.ipcMain

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

const saml = require('./saml');
let samlOptions = {
    callbackUrl: 'https://myapp/login/callback',
    entryPoint: "https://idp/saml/sso",
    cert: "base64 encoded cert without surrounding BEGIN CERT etc",
    logoutUrl: "https://idp/logout"
}

let samlAuth = new saml.SAML(samlOptions);

global.globalState = {
  currentUser: null,
  saml: samlAuth
}

function createWindow() {

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600
    })

    mainWindow.loadURL(`file://${__dirname}/login.html`)

    // Open the DevTools.
    mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})

ipcMain.on('user-logged-in', (event, arg) => {
    // console.log('user logged in ', arg)
    global.globalState.currentUser = arg
    mainWindow.loadURL(`file://${__dirname}/loggedin.html`)
})

ipcMain.on('user-logged-out', (event, arg) => {
    mainWindow.loadURL(`file://${__dirname}/loggedout.html`)
})

ipcMain.on('user-login-failed', (event, arg) => {
    mainWindow.loadURL(`file://${__dirname}/loggedout.html`)
})
