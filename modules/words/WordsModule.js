(function (angular) {
  'use strict'
  /**
   * ActivityModule - description
   *
   * @param  {type} config description
   * @return {type}        description
   */
  function WordModule (config) {
    var moduleConfig = config
	var baseName = moduleConfig.name.replace(/Module/,'');
	var controlerName = baseName + 'Controller';
	var urlName = baseName.replace(/(\w)/,function(v){return v.toLowerCase()});

	if(!moduleConfig.sref){
	moduleConfig.sref = '.' + urlName;
	}
    angular.module('electron-app')
      .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
          .state(`${moduleConfig.state}`, {
            url: '/words',
            views: {
              'module': {
                templateUrl: `${moduleConfig.path}/words.html`,
                controller: 'WordsController as ctrl'
              },
              'header@app': {
                template: `${moduleConfig.label}`
              },
              'toolbar@app': {
                templateUrl: `${moduleConfig.path}/words.actions.html`
              }
            }
          })
      })
    //var WordsService = require('./WordsService')
    var WordsController = require('./WordsController')

    //angular.module('electron-app').service('WordsService',WordsService)

    angular.module('electron-app').controller('WordsController', ['$scope', '$state', '$q','$mdSidenav','$mdDialog', '$mdToast','$timeout','$log','$interval','WordsService',WordsController])
  }
  module.exports = WordModule
})(global.angular)
