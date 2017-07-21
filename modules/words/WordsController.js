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
	
		var phonetic = item[3] ? item[3].split("#"):[];
		var wordGroup = item[4] ? item[4].split("#"):[];
		var example = item[5] ? item[5].split("#"):[];

		 $scope.selectedWord = {
			 wordname:item[1],
			 desc:item[2],
			 phonetic:phonetic,
			 wordGroup:wordGroup,
			 example:example
		 };
     this.play(item[0],item[1]);
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
	this.play = function(wordId,wordReal){
       var folder_size = 500
        var folder_name = 'within_' + String( ( parseInt( (wordId - 1) / folder_size) + 1) * folder_size )
        var save_path = 'assets/audios/' + folder_name
        var mp3_path = save_path + '/' + wordReal  + '.mp3'

        console.log('mp3_path',mp3_path);
	 var audio = new Audio(mp3_path);
   
        audio.currentTime = 0;
        audio.play();
  
	}
	//function end

  }
  module.exports = WordsController
})()
