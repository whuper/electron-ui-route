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
    angular.module('electron-app')
      .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
          .state(`${moduleConfig.state}`, {
            url: '/material',
            views: {
              'module': {
                templateUrl: `${moduleConfig.path}/material.html`,
                controller: 'MaterialController as ctl'
              },
              'header@app': {
                template: `${moduleConfig.label}`
              }
            }
          })
      })

    var MaterialController = require('./MaterialController') 
    angular.module('electron-app').controller('MaterialController', ['$scope', '$state', '$q','$mdSidenav',MaterialController])
  }
  module.exports = MaterialModule
})(global.angular)
