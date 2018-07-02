(function (angular) {
  'use strict'
  /**
   * ShellController - description
   *
   * @param  {type} $scope          description
   * @param  {type} $log            description
   * @param  {type} $q              description
   * @param  {type} $mdSidenav      description
   * @param  {type} modulesProvider description
   * @param  {type} ActivityService description
   * @return {type}                 description
   */
  function ShellController ($scope, $log, $q, $mdSidenav, modulesProvider) {
    var app = require('electron').remote.app;
    var BrowserWindow = app.getMainWindow();
    var notifier = require('electron-notifications')
    var appCfg = app.sysConfig()
    //BrowserWindow.webContents.openDevTools()
		//
	


    /**
     *
     */
    this.appName = `${appCfg.app.name} v${appCfg.app.version}`
    /**
     *
     */
    this.modules = []
    /**
     *
     */
    this.isBusy = false;
    this.isLoading = false;
    /**
     *
     */
    this.statusMessage = ''
    /**
     *
     */
    this.isDirty = false

    this.isDialOpen = false
    /**
     *
     */
  

    this.currentNavItem = 'history';
    /**
     *
     */
    this.setBusy = (msg) => {
      $q.when(true).then(() => {
        this.isBusy = true
        this.statusMessage = msg
        this.isDirty = false
      })
    }
    /**
     *
     */
    this.setReady = (dirty) => {
      $q.when(true).then(() => {
        this.isBusy = false
        this.statusMessage = ''
        this.isDirty = dirty
      })
    }

    this.setLoading = (val)=>{
      this.isLoading = val;
    }
    /**
     *
     */
    $scope.notify = (title, message) => {
      $q.when(true).then(() => {
        notifier.notify(title, {
          message: message,
          icon: appCfg.app.icon
        })
      })
    }
    /**
     *
     */
    $scope.createEventFromTemplate = (template, icon, error) => {
      return ActivityService.createEventFromTemplate(template, icon, error)
    }
    /**
     *
     */
    $scope.setError = (template, icon, error) => {
      $scope.notify('An error occured!', error.message)
      console.log(error)
      var info = $scope.createEventFromTemplate(template, icon, error)
      return $scope.writeLog('error', info)
    }
    /**
     *
     */
    $scope.writeLog = (type, info) => {
      var result
      switch (type) {
        case 'info':
          result = ActivityService.addInfo(info)
          break
        case 'warning':
          result = ActivityService.addWarning(info)
          break
        case 'error':
          result = ActivityService.addError(info)
          break
      }
      return result
    }
    /**
     * initialize function - description
     *
     * @return {type}  description
     */
    this.initialize = function () {
      
      BrowserWindow.show();
  
      this.modules = modulesProvider.modules 
      console.log('this.modules',this.modules);

      //window.modules = this.modules;
			///window.$scope = $scope;
      
      	//获取mac地址
/*		require('getmac').getMac(function(err,macAddress){
		    if (err) {
				console.log(err);			
			} else {
         console.log('macAddress',macAddress);
      }
		});*/
/*      return Promise.all([
        ActivityService.initialize()
      ])*/
      console.log('shell initialize');
      
      
      //BrowserWindow.show();
	  
    }
    /**
     * toggleFullscreen function - description
     *
     * @return {type}  description
     */
    this.toggleFullscreen = function () {
      app.toggleFullscreen()
    }
    
    this.toggleNav = function(){
        $mdSidenav('sidenav').toggle(); 
    }
    /**
     * platform function - description
     *
     * @return {type}  description
     */
    this.platform = function () {
      return appCfg.platform
    }
    /**
     * minimizeApp function - description
     *
     * @return {type}  description
     */
	this.mediumSize = function(){
		//var BrowserWindow = app.getMainWindow();

			BrowserWindow.setFullScreen(false);
			BrowserWindow.setSize(960,500,true);
			BrowserWindow.center()
	
	}

    this.minimizeApp = function () {
      app.minimizeAppToSysTray()
    }

    this.miniWindow = function(){
        BrowserWindow.minimize();
    },
    
    /**
     * closeApp function - description
     *
     * @return {type}  description
     */
    this.closeApp = function () {
      //关闭app时候做一些清理工作，比如关闭数据库
 /*       try {
        WordsService.closeDB();

      } catch(e){
        console.log(e);        

      } */
    
      //关闭以后BrowserWindow以后，main.js 会监听到，调用app.close
      BrowserWindow.close()
      //app.close()

      /*
      ActivityService.close().then(() => {
        app.close()
      })
     */
    }
    /**
     * sendEvent function - description
     */
    this.sendEvent = (event, arg) => {
      $q.when(true).then(() => {
        $scope.$broadcast(event, arg)
      })
    }
    /**
     * toggleSidebar function - description
     *
     * @return {type}  description
     */
    this.toggleSidebar = function () {
      var pending = $q.when(true)
      pending.then(() => {
        $mdSidenav('sidebar').toggle()
      })
    }

	this.openDevTools = function () {		
      // var BrowserWindow = app.getMainWindow();
      if(BrowserWindow.isDevToolsOpened()){
        BrowserWindow.webContents.closeDevTools()
      } else {
        BrowserWindow.webContents.openDevTools()
      }
    }

	
  }
  module.exports = ShellController
})(global.angular)
