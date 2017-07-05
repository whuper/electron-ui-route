(function () {
  'use strict'

  function MaterialController ($scope, $state, $q, $mdSidenav) {
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
    

        }; 

  }
  module.exports = MaterialController
})()
