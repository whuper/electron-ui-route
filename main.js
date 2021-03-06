(function () {
  'use strict'
  const electron = require('electron')
  //const electronDevTools = require('electron-devtools-installer')
  const app = electron.app
  const path = require('path')
  const os = require('os')
  const BrowserWindow = electron.BrowserWindow
  const Tray = electron.Tray
  const ipcMain = electron.ipcMain
  const Notification = electron.Notification

  // initialize service finder module
  //const ServiceFinder = require('node-servicefinder').ServiceFinder
  const appName = app.getName()
  const appVersion = app.getVersion()
  const dataDir = app.getPath('userData') + path.sep
  const cacheDir = app.getPath('userCache') + path.sep
  const tempDir = app.getPath('temp') + path.sep
  const homeDir = app.getPath('home') + path.sep
  const hostname = os.hostname()
  const username = (process.platform === 'win32') ? process.env.USERNAME : process.env.USER
  // report crashes to the Electron project
  // require('crash-reporter').start()
  // adds debug features like hotkeys for triggering dev tools and reload
  //require('electron-debug')()
  process.on('uncaughtException', onCrash)
  
  ipcMain.on('synchronous-message', (event, arg) => {
    console.log(arg) // prints "ping"

    event.returnValue = false;
  })

  // add this switch for the notification window
  app.commandLine.appendSwitch('--enable-transparent-visuals')
  /**
   * createMainWindow - create main application window
   *
   * @return {type}  description
   */
  function createMainWindow () {
    var win = new BrowserWindow({
      width: 1280,
      height: 800,
			transparent: true,
      frame: false,
      show: false,
      backgroundColor: '#2e2c29'
    })
    win.loadURL('file://' + __dirname + '/index.html');
    //调试
    //win.webContents.openDevTools()

    /*
    win.on('close', (event) => {
		
      console.log('win close');
			//event.preventDefault()
  
      //app.close();
    })
    */

    win.on('closed', () => {
      console.log('win closed');
      mainWindow = null;
      app.close();
    })

    /*win.once('ready-to-show', () => {
      win.show()
      console.log('ready-to-show');
    })*/

    
    win.webContents.on('crashed', onCrash)

    win.webContents.on('destroyed', (event) => {
      
      console.log('webContents destroyed');
 
      //console.log('win',win.destroyModule);
 
      
    })


	
    win.on('unresponsive', onCrash)
    return win
  }
  /**
   * onClosed - description
   *
   * @return {type}  description
   */
/*   function onClosed () {
    // deref the window
    // for multiple windows store them in an array
    mainWindow = null
  } */
  /**
   * onCrash - description
   *
   * @param  {type} exc description
   * @return {type}     description
   */
  function onCrash (exc) {
    console.log(exc)
  }
  /**
   * handleStartupEvent function - description
   *
   * @return {type}  description
   */
  var handleStartupEvent = function () {
    if (process.platform !== 'win32') {
      return false
    }
    var cp = require('child_process')
    var path = require('path')
    var updateDotExe = path.resolve(path.dirname(process.execPath), '..', 'update.exe')
    var target = path.basename(process.execPath)
    var squirrelCommand = process.argv[1]
    switch (squirrelCommand) {
      case '--squirrel-install':
      case '--squirrel-updated':
      // Optionally do things such as:
      //
      // - Install desktop and start menu shortcuts
      // - Add your .exe to the PATH
      // - Write to the registry for things like file associations and
      //   explorer context menus
      // create shortcuts
        cp.spawnSync(updateDotExe, ['--createShortcut', target], {
          detached: true
        })
        // Always quit when done
        app.quit()
        return true
      case '--squirrel-uninstall':
      // Undo anything you did in the --squirrel-install and
      // --squirrel-updated handlers
        cp.spawnSync(updateDotExe, ['--removeShortcut', target], {
          detached: true
        })
        // Always quit when done
        app.quit()
        return true
      case '--squirrel-obsolete':
        // This is called on the outgoing version of your app before
        // we update to the new version - it's the opposite of
        // --squirrel-updated
        app.quit()
        return true
    }
  }
  // check if we are being called by insaller routine
  if (handleStartupEvent()) {
    return
  }
  // prevent window being GC'd
  var mainWindow
  var trayIcon
  /**
   * activate function - description
   *
   * @return {type}  description
   */
  app.on('activate', function () {
    if (!mainWindow) {
      mainWindow = createMainWindow()
    }
  })
  /**
   * ready function - description
   *
   * @return {type}  description
   */
  app.on('ready', function () {
    mainWindow = createMainWindow();
  
    console.log('app on ready',new Date());
    
	  /*
    const isDev = require('electron-is-dev')
    if (isDev) {
      electronDevTools.default(electronDevTools.ANGULARJS_BATARANG);
    }
	*/
  })

	  // 当全部窗口关闭时退出。
  app.on('window-all-closed', () => {
    // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
    // 否则绝大部分应用及其菜单栏会保持激活。
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
  

  app.on('quit',function() {
  
    console.log('app quit');
    
  });

  /**
   * serviceFinder function - description
   *
   * @param  {type} serviceName  description
   * @param  {type} protocol     description
   * @param  {type} subTypes     description
   * @param  {type} includeLocal description
   * @return {type}              description
  
  app.serviceFinder = function (serviceName, protocol, subTypes, includeLocal) {
    return new ServiceFinder(serviceName, protocol, subTypes, includeLocal)
  }
  *
   * sysConfig function - description
   *
   * @return {type}  description
   */
  app.sysConfig = function () {
    return {
      app: {
        name: appName,
        version: appVersion,
        icon: path.join(__dirname, 'assets', 'y4.png')
      },
      host: hostname,
      platform: process.platform,
      user: username,
      paths: {
        home: homeDir,
        temp: tempDir,
        data: dataDir,
        cache: cacheDir,
        dirname:__dirname
      }
    }
  }
  /**
   * getMainWindow function - description
   *
   * @return {type}  description
   */
  app.getMainWindow = function () {
    return mainWindow
  }
  /**
   * close function - description
   *
   * @return {type}  description
   */
  app.close = function () {
    if (mainWindow) {
      mainWindow.close()
    }
    app.quit()
  }
  /**
   * toggleFullscreen function - description
   *
   * @return {type}  description
   */
  app.toggleFullscreen = function () {
    if (mainWindow) {
			console.log(mainWindow.isFullScreen());
      mainWindow.setFullScreen(!mainWindow.isFullScreen())
    }
  }
  /**
   * minimizeAppToSysTray function - description
   *
   * @return {type}  description
   */
  app.minimizeAppToSysTray = function () {
    trayIcon = new Tray(path.join(__dirname, 'assets', 'y4_tray.png'))
    trayIcon.setToolTip('App is running in background mode.')
    trayIcon.on('click', () => {
      if (mainWindow) {
        mainWindow.show()
        trayIcon.destroy()
      }
    })
    if (mainWindow) {
      mainWindow.hide()
    }
  }
  
})()
