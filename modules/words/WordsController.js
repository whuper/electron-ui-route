(function () {
  'use strict'

  function WordsController ($scope, $state, $q, $mdSidenav,$mdDialog, $mdToast,$timeout,$log,$interval,WordsService) {
    /**
     *
     */

	var app = require('electron').remote.app;
	var BrowserWindow = app.getMainWindow();

	const {dialog} = require('electron').remote;
	var historyFile = './assets/history.json';

	var trueClose = false;
	var wordsArray = [];
	var wordsNo = 0;
	var wordAudio = new Audio();
	var clickAudio = new Audio('./assets/click.mp3');
	clickAudio.loop = true;
	
	window.addEventListener('keydown',function(e) {	
		if(e && (e.metaKey || e.ctrlKey )){  
				if (e.key == 'r') {
					trueCloseHander('reload');											
				}
			}
		},true)

	wordAudio.addEventListener('ended',playEndedHandler,false);
	
	window.addEventListener('beforeunload',(e) => {
		console.log('I do not want to be closed')	
	  
		// 与通常的浏览器不同,会提示给用户一个消息框,
		//返回非空值将默认取消关闭
		//建议使用对话框 API 让用户确认关闭应用程序.

		if(!trueClose){
			e.returnValue = false;

/* 			dialog.showMessageBox(BrowserWindow,{type:'none',message:' Are you sure want to do this',buttons:['取消','确定']},function(response){
				if(response == 1){
					trueClose = true // 相当于 `return false` ，但是不推荐使用
					BrowserWindow.close();
	
				} else {
					trueClose = false // 相当于 `return false` ，但是不推荐使用
				}				
	
			}); */
			this.showConfirm();		

		}

	  }

	);
	  

	var interval_;
	var timeout_;

	var os = require('os');
	var homedir = os.homedir();
	

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
	$scope.$parent.shell.currentNavItem = 'history';

  WordsService.getWordsList($scope.query).then(function(json){
  $scope.wordResult = json;

  //console.log('##',$scope.$parent.shell);
  
  //$scope.$parent.shell.$scope.setReady();
  
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
  $scope.currentHistory = [];

  this.getHistoryWords();
		 
	};

	this.getHistoryWords = function(){	
		try {
			var fs = require('fs');
			var historyWords = JSON.parse(fs.readFileSync(historyFile,"utf8"));
			$scope.historyWords = historyWords;
		} catch(e) {
			console.log(e);
			$scope.historyWords = [];
		
		}
		console.log('$scope.historyWords',$scope.historyWords);
	},

	// initialize end 

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
		let time = app.getNowFormatDate();

		$scope.currentHistory.unshift({
			word:item['words'],
			id:item['id'],
			time:time
		});		
		$scope.ctrl.selectWord(item);
	};
	
	this.searchWordSpec = function (word) {

		WordsService.searchWords(word,true).then(function(json){
			console.log('json.list',json.list);		
			$scope.tableName = json.flag;
			$scope.selectedWordDialog = json.list[0];

			$scope.ctrl.selectWord(json.list[0],true);

			$scope.ctrl.showPrerenderedDialog();
		});
		
	};

	this.showPrerenderedDialog = function() {
		$mdDialog.show({
		  contentElement: '#myDialog',
		  parent: angular.element(document.body),
		  clickOutsideToClose: true
		});
	  };
	


    /**
     * Create filter function for a query string
     */
     this.createFilterFor = function(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(state) {
        return (state.value.indexOf(lowercaseQuery) === 0);
      };

    }
	 this.selectWord = function(item,dialog){

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
					
					//arr[index] = element.replace(reg,"## $1");
					arr[index] = element.replace(reg,"");

				});
		
		}
		if(dialog){

			$scope.selectedWordDialog = {
				id:item['id'],
				wordname:item['words'],
				desc:item['meaning'],
				phonetic:phonetic,
				wordGroup:wordGroup,
				example:example
			};


		} else {

			$scope.selectedWord = {
				id:item['id'],
				wordname:item['words'],
				desc:item['meaning'],
				phonetic:phonetic,
				wordGroup:wordGroup,
				example:example
			};
			// $scope.currentNavItem = 'info';
			$scope.$parent.shell.currentNavItem  = 'info';
			
			this.play(item['id'],item['words'],false);
			

		}

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
       $mdSidenav(menuId).toggle();    

        }; 
	this.speak = function(sentence){
		
		var stop = sentence.search(/[\u4e00-\u9fa5]/);
		if(stop != -1 && stop > 0){
			var enSentence = sentence.substring(0,stop);
		} else {
			var enSentence = sentence;
		}
		
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
	
	};
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

	this.showConfirm = function() {
		
		var confirm = $mdDialog.confirm()
			  .title('Would you like to do this?')
			  //.textContent('All of the banks have agreed to forgive you your debts.')
			  .ok('Yes')
			  .cancel('cancel');
	
		$mdDialog.show(confirm).then(function() {
		  //$scope.status = 'You decided to get rid of your debt.';
		  trueCloseHander();
		}, function() {
		  //$scope.status = 'You decided to keep your debt.';
		});
	  };
	


/*  this.goto = function(page) {

	  $scope.currentNavItem = page;
	  console.log('$scope.currentNavItem',$scope.currentNavItem);
	  
	  
    }; */ 

	// end
	
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

function trueCloseHander(type){
trueClose = true;
// var deferred = $q.defer();
try {
	var fs = require('fs');
	let allHistoryWords = $scope.currentHistory.concat($scope.historyWords);
	   
     WordsService.closeDB();

  
	fs.writeFile(historyFile,JSON.stringify(allHistoryWords,null,4), "utf8",function(err){

	if(type == 'reload'){
		BrowserWindow.reload();
	} else{
		BrowserWindow.close();
	}

	
	});


} catch(e){
	console.log(e);
	trueClose = false;
}

}
  }
  module.exports = WordsController
})()
