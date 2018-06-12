(function () {
  'use strict'

  function WordsController ($scope, $state, $q, $mdSidenav,$mdDialog, $mdToast,$timeout,$log,$interval,WordsService) {
    /**
     *
     */
    this.events = []
	this.noCache = true;

	var wordsArray = [];
	var wordsNo = 0;
	var wordAudio = new Audio();
	var clickAudio = new Audio('./assets/click.mp3');
          clickAudio.loop = true;

	wordAudio.addEventListener('ended',playEndedHandler,false);

	var interval_;
	var timeout_;

	var os = require('os');
	var homedir = os.homedir();

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
  WordsService.getWordsList($scope.query).then(function(json){
  
  $scope.wordResult = json;
  
  });
  function success(desserts) {
    $scope.desserts = desserts;
  }
  
  $scope.getItems = function(){
	 console.log($scope.query);
	 WordsService.getWordsList($scope.query).then(function(json){
		  $scope.wordResult = json;
	 });
  };
		 
    };

	//aotocomplete
	 this.newState = function(state) {
      alert("Sorry! You'll need to create a Constitution for " + state + " first!");
    }
    this.searchTextChange = function(text) {
	
		console.log('text',text);
	
		/*WordsService.searchWords(text).then(function(json){
			if(json && json.length > 0){
				$scope.searchResults = json;
			} else {
				$scope.searchResults = [];			
			}
		});

		  deferred = $q.defer();
        $timeout(function () { 
			deferred.resolve( results );
			console.log('results',results);
		}, Math.random() * 1000, false);
        return deferred.promise;
		*/

		//$scope.searchResults = WordsService.searchWords(text);
	
		
    }
	this.searchResults = function(text) {
		console.log('text',text);
		if(!text){
		return false;
		}
		var deferred = $q.defer();
		WordsService.searchWords(text).then(function(json){
			deferred.resolve(json.list);		
			$scope.tableName = json.flag;
		});

		return deferred.promise;

	}

    this.selectedItemChange = function(item) {
		//选择一个选项
		if(!item){
			return false;
		}
		$scope.ctrl.selectWord(item);
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

        if($scope.spellWordName && $scope.selectedWord && $scope.selectedWord['id'] == item['id']){
            return false;        
        }
	
		var phonetic = item['phonetic'] ? item['phonetic'].split("#"):[];
		var wordGroup = item['wordsGroup'] ? item['wordsGroup'].split("#"):[];
		var example = item['example'] ? item['example'].split("#"):[];

		if(example.length){

				example.forEach(function(element,index,arr){
					//提取网址
					var reg = /([\da-z\.-]+)\.([a-z\.]{2,6})/g;
					 
					/*element.replace(reg,function(match){
						console.log('match',match);
								return element.replace(match,'');						
							//return '<br />' + match;
						});*/
					
					arr[index] = element.replace(reg,"## $1");

				});
		
		}
	


		 $scope.selectedWord = {
			 id:item['id'],
			 wordname:item['words'],
			 desc:item['meaning'],
			 phonetic:phonetic,
			 wordGroup:wordGroup,
			 example:example
		 };
     this.play(item['id'],item['words'],false);
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
            console.log('mdSidenav',menuI);
       $mdSidenav(menuId).toggle();    

        }; 
	this.speak = function(sentence){
		
		var stop = sentence.search(/[\u4e00-\u9fa5]/);
		if(stop != -1 && stop > 0){
			var enSentence = sentence.substring(0,stop);
		} else {
			var enSentence = sentence;
		}
		
		console.log('enSentence',enSentence);
		//匹配出英文单词
		var wordsArr = enSentence.match(/[a-z]+[\-\']?[a-z]*/ig);

		console.log('wordsArr',wordsArr);

		WordsService.getWordsArray(wordsArr).then(function(json){

			 wordsArray = json;
			 $scope.ctrl.play(wordsArray[wordsNo]['id'],wordsArray[wordsNo]['words'],true,true);		
		});

		
	};
	this.play = function(wordId,wordReal,isDict,noSpell){
		//if(wordAudio && !wordAudio.ended){
			//return false;
		//}
		console.log('wordReal',wordReal);
    var folder_size = 500
    var folder_name = 'within_' + String( ( parseInt( (wordId - 1) / folder_size) + 1) * folder_size )
		if(isDict){
        var save_path = homedir + '/myfiles/audios_15328/' + folder_name
		} else {
        var save_path = homedir + '/myfiles/audios/' + folder_name
		}
        var mp3_path = save_path + '/' + wordReal  + '.mp3'
		
		wordAudio.src = mp3_path;
		/*if(wordsArray && wordsArray.length > 0){
		wordAudio.addEventListener('ended',playEndedHandler,false);
		}*/
        wordAudio.currentTime = 0;
        wordAudio.play();

		if(!noSpell){
			$scope.ctrl.spell(wordReal);
			//$scope.spellWordName = wordReal;
		}
		
		//调用父state中controller中的方法
		//$scope.$parent.shell.toggleSidebar();
	};
	this.spellNew = function(){
	
	},
	this.spell = function(wordReal){
		$scope.LetterNo = 0;
		$scope.spellWordName = '';

		if(interval_ || timeout_){
			$interval.cancel(interval_);
			$timeout.cancel(timeout_);
			//return
		}
        clickAudio.currentTime = 0;
        clickAudio.play();
	
		interval_ = $interval(function(){

			if($scope.LetterNo >= wordReal.length){
				$interval.cancel(interval_)

                 clickAudio.pause();

				timeout_ = $timeout(function(){
					console.log('clear');
					wordsArray = [];
					$scope.spellWordName = '';
				},1000);
            return false;
			}
			$scope.spellWordName += wordReal[$scope.LetterNo];
			$scope.LetterNo += 1;

		},200);
  
	};
	//function end
	
		//音频播放结束执行的函数
		function playEndedHandler(){
			console.log('ended');
			wordsNo += 1;
			if(!wordsArray.length || wordsArray.length == wordsNo){
				
				//wordAudio.removeEventListener('ended',playEndedHandler,false);				
			
				wordsNo = 0;
				wordsArray = [];
				console.log('停止');
				return false;
			}
			console.log('播放下一个单词',wordsArray[wordsNo]);
			
			$scope.ctrl.play(wordsArray[wordsNo]['id'],wordsArray[wordsNo]['words'],true,true);
			
		}

  }
  module.exports = WordsController
})()
