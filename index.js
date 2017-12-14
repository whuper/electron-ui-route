(function (angular) {
  'use strict'
  angular.module('electron-app', ['ngMaterial', 'ngSanitize','ngMessages', 'ui.router', 'ngAnimate', 'angular-timeline', 'angular-centered','md.data.table'])
    .config(function ($mdThemingProvider,$mdIconProvider) {
      $mdThemingProvider.theme('default')
        .primaryPalette('green')
        .accentPalette('red')
	$mdThemingProvider.theme('docs-dark', 'default')
      .primaryPalette('yellow')
      .dark();
    })
    .config(function ($stateProvider, $urlRouterProvider) {
      var appcfg = require('./appcfg')
      var defaultRoute = appcfg.modules[appcfg.defaultModule].url
      // for all unmatched entries
      $urlRouterProvider.otherwise(defaultRoute)
      // separate states
      $stateProvider
        .state('app', {
          url: '/app',
          abstract: true,
          templateUrl: './shell/views/shell.html',
          controller: 'ShellController as shell'
        })
    })
    .run(function ($rootScope, $state, $stateParams) {
        // It's very handy to add references to $state and $stateParams to the $rootScope
        // so that you can access them from any scope within your applications.For example,
        // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
        // to active whenever 'contacts.list' or one of its decendents is active.
        $rootScope.$state = $state
        $rootScope.$stateParams = $stateParams

/*         var urls = [
            'img/icons/share-arrow.svg',
            'img/icons/upload.svg',
            'img/icons/copy.svg',
            'img/icons/print.svg',
            'img/icons/hangout.svg',
            'img/icons/mail.svg',
            'img/icons/message.svg',
            'img/icons/copy2.svg',
            'img/icons/facebook.svg',
            'img/icons/twitter.svg'
          ];

        angular.forEach(urls, function(url) {
            $templateRequest(url);
          });*/
      }
    )
  // var PouchDBService = require('./shell/services/PouchDBService')
  // var LovefieldService = require('./shell/services/LovefieldService')
  // var RDFStoreService = require('./shell/services/RDFStoreService')
  // var ActivityDataService = require('./shell/services/ActivityDataService')
  // var ActivityService = require('./shell/services/ActivityService')
  var WordsService = require('./modules/words/WordsService')

  var ModuleProvider = require('./scripts/ModuleProvider')
  var ShellController = require('./shell/controllers/ShellController')
  // hint: has to initialize modules here, otherwise controller objects are not found :(
  ModuleProvider.loadModules()
  angular.module('electron-app').provider('modules', [ModuleProvider])
  angular.module('electron-app').service('WordsService',['$q',WordsService])
  // angular.module('electron-app').service('PouchDBService', [PouchDBService])
  // angular.module('electron-app').service('LovefieldService', [LovefieldService])
  // angular.module('electron-app').service('RDFStoreService', [RDFStoreService])
  // angular.module('electron-app').service('ActivityDataService', ['PouchDBService', ActivityDataService])
  // angular.module('electron-app').service('ActivityService', ['ActivityDataService', ActivityService])
  // angular.module('electron-app').controller('ShellController', ['$scope', '$log', '$q', '$mdSidenav', 'modules', 'ActivityService', ShellController])
  angular.module('electron-app').controller('ShellController', ['$scope', '$log', '$q', '$mdSidenav', 'modules','WordsService', ShellController])
})(global.angular)
