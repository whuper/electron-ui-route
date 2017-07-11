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
        
  $scope.selected = [];
  
  $scope.query = {
    order: 'name',
    limit: 10,
    page: 1
  };
  $scope.wordResult = WordsService.getWordsList($scope.query)

   
  
  function success(desserts) {
    $scope.desserts = desserts;
  }
  
  $scope.getItems = function () {
	 console.log($scope.query);
	 $scope.wordResult = WordsService.getWordsList($scope.query);
    //$scope.promise = $nutrition.desserts.get($scope.query, success).$promise;
  };
		 
    };

    this.toggleSidenav = (evt,menuId) => {
            console.log('mdSidenav',menuId);
       $mdSidenav(menuId).toggle();    

        }; 
	this.play = function(){
	 var audio = new Audio(__dirname + '/wav/' + soundName + '.wav');
   
        audio.currentTime = 0;
        audio.play();
  
	}
	//function end

  }
  module.exports = WordsController
})()
