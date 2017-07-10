(function (angular) {
  'use strict'

  function MaterialDireDemoModule (config) {
    var moduleConfig = config
    angular.module('electron-app')
      .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
          .state(`${moduleConfig.state}`, {
            url: '/materialDireDemo',
            views: {
              'module': {
                templateUrl: `${moduleConfig.path}/materialDireDemo.html`,
                controller: 'MaterialDireDemoController as ctrl'
              },
              'header@app': {
                template: `${moduleConfig.label}`
              }
            }
          })
      })

    var MaterialDireDemoController = require('./MaterialDireDemoController') 
    angular.module('electron-app').controller('MaterialDireDemoController', ['$scope', '$state', '$q','$mdBottomSheet','$mdDialog', '$mdToast', '$timeout','$log','$interval',MaterialDireDemoController])
  }
  module.exports = MaterialDireDemoModule
})(global.angular)
