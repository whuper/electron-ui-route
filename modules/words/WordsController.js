(function () {
  'use strict'

  function WordsController ($scope, $state, $q, $mdSidenav,WordsService) {
    /**
     *
     */
    this.events = []
    /**
     * initialize function - description
     *
     * @return {Promise}  description
     */

    this.initialize = function () {
      console.log('WordsController initialize');
         $scope.wordResult = WordsService.getWordsList();
    }
    
    this.toggleSidenav = (evt,menuId) => {
            console.log('mdSidenav',menuId);
       $mdSidenav(menuId).toggle();    

        }; 

  }
  module.exports = WordsController
})()
