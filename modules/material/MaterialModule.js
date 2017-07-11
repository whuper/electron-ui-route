(function (angular) {
  'use strict'
  /**
   * ActivityModule - description
   *
   * @param  {type} config description
   * @return {type}        description
   */
  function MaterialModule (config) {
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
            url: '/material',
            views: {
              'module': {
                templateUrl: `${moduleConfig.path}/material.html`,
                controller: 'MaterialController as ctrl'
              },
              'header@app': {
                template: `${moduleConfig.label}`
              }
            }
          })
      })

    var MaterialController = require('./MaterialController') 
    angular.module('electron-app').controller('MaterialController', ['$scope', '$state', '$q','$mdBottomSheet','$mdDialog', '$mdToast', MaterialController])
  }
  module.exports = MaterialModule
})(global.angular)
