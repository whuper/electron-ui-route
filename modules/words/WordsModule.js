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
    angular.module('electron-app')
      .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
          .state(`${moduleConfig.state}`, {
            url: '/words',
            views: {
              'module': {
                templateUrl: `${moduleConfig.path}/words.html`,
                controller: 'WordsController as ctl'
              },
              'header@app': {
                template: `${moduleConfig.label}`
              }
            }
          })
      })
    var WordsService = require('./WordsService')
    var WordsController = require('./WordsController')

    angular.module('electron-app').service('WordsService', ['PouchDBService',WordsService])

    angular.module('electron-app').controller('WordsController', ['$scope', '$state', '$q','$mdSidenav','WordsService',WordsController])
  }
  module.exports = WordModule
})(global.angular)
