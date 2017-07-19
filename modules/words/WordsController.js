(function () {
  'use strict'

  function WordsController ($scope, $state, $q, $mdSidenav,$mdDialog, $mdToast,$timeout,$log,$interval,WordsService) {
    /**
     *
     */
    this.events = []
	this.noCache = true;

    /**
     * initialize function - description
     *
     * @return {Promise}  description
     */

    this.initialize = function () {
    
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

	//aotocomplete
	 this.newState = function(state) {
      alert("Sorry! You'll need to create a Constitution for " + state + " first!");
    }

     this.searchTextChange2 = function(query) {
		 console.log('querySearch');
      var results,deferred;
        deferred = $q.defer();
		var results = WordsService.searchWords(query);
		console.log('results',results);
		deferred.resolve( results )

        /*$timeout(function () { 
			deferred.resolve( results );
			console.log('results',results);
		}, Math.random() * 1000, false);*/
        return deferred.promise;
     
    }

    this.searchTextChange = function(text) {
		var results = WordsService.searchWords(text);
		$scope.searchResults = results;
		console.log('$scope.searchResults',$scope.searchResults);
      $log.info('Text changed to ' + text);
    }

    this.selectedItemChange = function(item) {
      $log.info('Item changed to ' + JSON.stringify(item));
    }


    /**
     * Create filter function for a query string
     */
     this.createFilterFor = function(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(state) {
        return (state.value.indexOf(lowercaseQuery) === 0);
      };

    }
	 this.selectWord = function(item){
		 $scope.selectedWord = item;	 
	 },
    
    this.showAlert = function () {
      dialog = $mdDialog.alert({
        title: 'Attention',
        textContent: 'This is an example of how easy dialogs can be!',
        ok: 'Close'
      });

      $mdDialog.show(dialog)
      /*     .finally(function() {
             dialog = undefined;
           });*/
    }

    this.closeAlert = function () {
      $mdDialog.hide(dialog, "finished");
      dialog = undefined;
    }
	//toggleSidenav

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
