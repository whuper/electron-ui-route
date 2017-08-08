(function (angular) {
  'use strict'

  function FileExplorerModule (config) {
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
            url: `/${urlName}`,
            views: {
              'module': {
                templateUrl: `${moduleConfig.path}/${baseName}.html`,
                controller: `${controlerName} as ctrl`
              },
              'header@app': {
                template: `${moduleConfig.label}`
              }
            }
          })
      })

    var tmpController = require('./' + controlerName) 
    angular.module('electron-app').controller(controlerName, ['$scope', '$state', '$q','$mdBottomSheet','$mdDialog', '$mdToast', '$timeout','$log','$interval',tmpController])
  }
  module.exports = FileExplorerModule
})(global.angular)
