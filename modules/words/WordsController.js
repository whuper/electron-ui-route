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

    }
    
    this.toggleSidenav = (evt,menuId) => {
            console.log('mdSidenav',menuId);
       $mdSidenav(menuId).toggle();

       var wordlist = WordsService.getWordsList()
       console.log(wordlist);
        }; 

  }
  module.exports = WordsController
})()
