(function () {
  'use strict'

  function WordsController ($scope, $state, $q, $mdSidenav,$mdDialog, $mdToast,$timeout,$log,$interval,WordsService) {
    /**
     *
     */

	var app = require('electron').remote.app;
	var MainWindow = app.getMainWindow();

	var fs = require('fs');	

	const {dialog} = require('electron').remote;
	const {ipcRenderer} = require('electron')

	var utilHao = require(app.sysConfig().paths.dirname + '/util-hao.js');

	var historyFile = './assets/history.json';
	var audioListFile = './assets/temp/audios.json';
	var stateFile = './assets/state.json'; 

	var stateObj = {};
	var audioList = [];
	var audioListCurrent = [];

	var trueClose = false;
	var wordsArray = [];
	var wordsNo = 0;
	var playInterval = null;
	var wordAudio = new Audio();
	var clickAudio = new Audio('./assets/click.mp3');
	clickAudio.loop = true;


	
	window.addEventListener('keydown',function(e) {
		if(!e){
			return false;
		}	
		if(e.metaKey || e.ctrlKey ){  
				if (e.key == 'r') {
					trueCloseHander('reload');											
				}
			} else {

				if(e.keyCode == 27){

					$scope.ctrl.stopPlay();						

				}	

				if(!$scope.ctrl.tableIsfocus){
					return false;
				}		
							
				switch (e.keyCode) {
					case 38:
						//console.log('38=上键，37=左键');
						if($scope.currentItemIndex > 0){
							$scope.currentItemIndex -= 1;
						}							
						break;
					case 40:
						//console.log('40=下键，39=右键',$scope.currentItemIndex < $scope.wordResult.length);
						if($scope.currentItemIndex < $scope.wordResult.length-1){

							$scope.currentItemIndex += 1;
						}
						break;
					case 13:
						e.preventDefault();
						//return false;
					/*
						let index = $scope.currentItemIndex;
						let tempItem = $scope.wordResult[index];

						$scope.ctrl.selectWord(tempItem,null,index,false);

						let notification = {
							title:tempItem.words,
							body:tempItem.meaning
						};

						ipcRenderer.sendSync('synchronous-message',notification);					
					
						const myNotification = new window.Notification(notification.title, notification)

						myNotification.onclick = () => {
						  console.log('Notification clicked')
						} */
						//自动朗读
						
						//$scope.ctrl.autoPlayAll();		
						break;
					case 33:
						if($scope.query.page > 1){
							$scope.query.page -= 1;
							$scope.getItems();
						}					
						break;
					case 34:	
						try{
							$scope.query.page += 1;
							$scope.getItems();	
						}catch(e){
							console.log(e);
							
						}

						break;
					default:
						break;
				}
				$scope.$apply(function(){
					//$scope.currentItemIndex = 3;
				}); 
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

/* 			dialog.showMessageBox(MainWindow,{type:'none',message:' Are you sure want to do this',buttons:['取消','确定']},function(response){
				if(response == 1){
					trueClose = true // 相当于 `return false` ，但是不推荐使用
					MainWindow.close();
	
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

		console.log('__dirname',__dirname);
		
    
  

	stateObj = this.getState();
  
  $scope.query = {
    order: 'name',
    limit: 10,
    page: stateObj.page
  };
	$scope.selectedWord = stateObj.selectedWord;

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
	//  console.log($scope.query);
	 WordsService.getWordsList($scope.query).then(function(json){
		  $scope.wordResult = json;
	 });
  };

  $scope.currentHistory = [];

  $scope.currentItemIndex = 0;


  this.getHistoryWords();
		 
	};
	this.moduleClick = function(event) {
		
		if(event.target.tagName == 'TH' || event.target.tagName == 'TD' ){
			this.tableIsfocus = true;
		} else {
			this.tableIsfocus = false;

		}
	};

	this.getState = function(){
	
		
		try {
			return JSON.parse(fs.readFileSync(stateFile,"utf8"));
		} catch (error) {
			console.log(error);			
			return {page:1};
		}
	}
	this.getHistoryWords = function(){	
		try {
			var fs = require('fs');
			var historyWords = JSON.parse(fs.readFileSync(historyFile,"utf8"));
			
			$scope.historyWords = historyWords;
		} catch(e) {
			console.log(e);
			$scope.historyWords = [];
		
		}

		try {
			audioList = JSON.parse(fs.readFileSync(audioListFile,"utf8"));
		} catch (error) {
			console.log(error);			
		}

	
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
	
		
	};
	this.autoPlayAll = function(isSelectedWord){
		window.clearInterval(playInterval);
		// $scope.shell.setBusy('阅读模式...');
		$scope.shell.setLoading(true);
		playInterval = window.setInterval(function(){
			if($scope.currentItemIndex < $scope.wordResult.length-1){
				$scope.currentItemIndex += 1;
			} else {
				$scope.currentItemIndex = 0;
				//翻页
				$scope.query.page += 1;
				$scope.getItems();
				$scope.$apply();

				setTimeout(function(){

					let curItem = 	$scope.wordResult[$scope.currentItemIndex];	
					if(isSelectedWord){
						$scope.ctrl.selectWord(curItem,false,$scope.currentItemIndex,true);
					}
					$scope.ctrl.newWin.webContents.send('update-word', curItem);
					$scope.ctrl.play(curItem['id'],curItem['words'],'english','nospell');	


				},200);
				return;
			}
			
			$scope.$apply();

			let curItem = 	$scope.wordResult[$scope.currentItemIndex];	
			if(isSelectedWord){
				$scope.ctrl.selectWord(curItem,false,$scope.currentItemIndex,true);
			}
			$scope.ctrl.newWin.webContents.send('update-word', curItem);
			$scope.ctrl.play(curItem['id'],curItem['words'],'english','nospell');

	
		},7000);

	};
	this.stopPlay = function(){

		$scope.shell.setLoading(false);
		if($scope.ctrl.newWin){
			$scope.ctrl.newWin.close();
		}
		

		window.clearInterval(playInterval);

	};
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
	
		let time = utilHao.getNowFormatDate();

		$scope.currentHistory.unshift({
			word:item['words'],
			id:item['id'],
			time:time
		});
		console.log(time);
		
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
	 this.selectWord = function(item,dialog,itemIndex,nospell){

        if($scope.spellWordName && $scope.selectedWord && $scope.selectedWord['id'] == item['id']){
            return false;        
		}
		if(itemIndex){
			$scope.currentItemIndex = itemIndex;			
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

			$scope.tableName = 'english';
			
			this.play(item['id'],item['words'],false,nospell);
			

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
	this.speak = function(sentence,baiduAi){
		
		var stop = sentence.search(/[\u4e00-\u9fa5]/);
		if(stop != -1 && stop > 0){
			var enSentence = sentence.substring(0,stop);
		} else {
			var enSentence = sentence;
		}
		if(baiduAi){

			let audioName = utilHao.excludeSpecial(enSentence,' ');
			console.log('audioName',audioName);

			//直接重从本地定位,并读取文件

			$scope.ctrl.play($scope.selectedWord.id,audioName,'baiduAudio','nospell');

			return;
			// ----先判断本地有没有
		
			if(audioList.indexOf(audioName) != -1){
				console.log('不必请求');
				var filePathName = './assets/temp/' + audioName + '.mp3';
				this.playAudio(filePathName);
			} else {
				$scope.shell.setBusy('waiting');				
				aiSpeek(enSentence,audioName);
			}

		} else {
			//匹配出英文单词
			var wordsArr = enSentence.match(/[a-z]+[\-\']?[a-z]*/ig);

			WordsService.getWordsArray(wordsArr).then(function(json){

				wordsArray = json;
				$scope.ctrl.play(wordsArray[wordsNo]['id'],wordsArray[wordsNo]['words'],'dict',true);		
			});
		}
		

		
	};
	this.play = function(wordId,wordReal,type,noSpell){
		//if(wordAudio && !wordAudio.ended){
			//return false;
		//}
		
    	var folder_size = 500
		var folder_name = 'within_' + String( ( parseInt( (wordId - 1) / folder_size) + 1) * folder_size );

		var soundOff = false;
		
		switch (type) {
			case 'english':
				var save_path = homedir + '/files-wenhao/audios/' + folder_name;				
				break;
			case 'dict':
				var save_path = homedir + '/files-wenhao/audios_15328/' + folder_name;
				
				break;
			case 'baiduAudio':
				var save_path = homedir + '/files-wenhao/baiduSpeech/' + folder_name;
				soundOff = true;		
				break;		
			default:
				var save_path = homedir + '/files-wenhao/audios/' + folder_name;
				break;
		}



		var mp3_path = save_path + '/' + wordReal  + '.mp3'
		
		this.playAudio(mp3_path);

		if(!noSpell){
			$scope.ctrl.spell(wordReal,soundOff);
			//$scope.spellWordName = wordReal;
		}
		
		//调用父state中controller中的方法
		//$scope.$parent.shell.toggleSidebar();
	};
	this.playAudio = function(path){
		try{
			wordAudio.src = path;
	
			wordAudio.currentTime = 0;
			wordAudio.play();
		} catch(e) {
			console.log('加载音频出错',e);
			
		}
	
	},
	this.spellNew = function(){
	
	};
	this.updateWords = function(item){

		console.log('updateWords',item);

		createWindow();
		
	},
	this.spell = function(wordReal,soundOff){
		$scope.LetterNo = 0;
		$scope.spellWordName = '';

		if(interval_ || timeout_){
			$interval.cancel(interval_);
			$timeout.cancel(timeout_);
			//return
		}
		if(!soundOff){
			clickAudio.currentTime = 0;
			clickAudio.play();
		} 
	
		interval_ = $interval(function(){

			if($scope.LetterNo >= wordReal.length){
				$interval.cancel(interval_)
				
				if(!soundOff){
					clickAudio.pause();
				}

				timeout_ = $timeout(function(){
					console.log('clear');
					wordsArray = [];
					$scope.spellWordName = '';
				},1000);
            return false;
			}
			$scope.spellWordName += wordReal[$scope.LetterNo];
			$scope.LetterNo += 1;

		},130);
  
	};

	this.showConfirm = function() {
		
		var confirm = $mdDialog.confirm()
			  .title('Would you like to do this?')
			  .textContent('This will exit the program.')
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
			
			$scope.ctrl.play(wordsArray[wordsNo]['id'],wordsArray[wordsNo]['words'],'dict',true);
			
		}


function writeState(){

	var defered = $q.defer();
	setTimeout(function(){	

		//写入单词当前页码,和单词
		try {
			stateObj.page = $scope.query.page;
			stateObj.selectedWord = $scope.selectedWord
		console.log('stateObj',stateObj);
			fs.writeFile(stateFile,JSON.stringify(stateObj,null,4), "utf8",function(err){
				if(err){
					defered.reject(err);
				}else {
					defered.resolve('ok3');
				}
			});
		} catch(e){
			defered.reject(e);
		}
	},200);

	return defered.promise;

}
function writeHistory(){

	var defered = $q.defer();
	setTimeout(function(){	

		if($scope.currentHistory.length > 0){
			var allHistoryWords = $scope.currentHistory.concat($scope.historyWords);		

		} else {
			defered.resolve('ok1');
			return;
		}		
		//写入单词json文件
		try {
			if(!allHistoryWords || allHistoryWords.length < 1){
				console.log('历史危险');	
				return;
			}
			fs.writeFile(historyFile,JSON.stringify(allHistoryWords,null,4), "utf8",function(err){
				if(err){
					defered.reject(err);
				}else {
					defered.resolve('ok2');
				}
			});
		} catch(e){
			defered.reject(e);
		}
	},200);

	return defered.promise;

}

function writeAudioFile(){
	var defered = $q.defer();

	setTimeout(function(){
	
		if(audioListCurrent.length < 1){
			defered.resolve('ok3');
			return;
		}			
		try {
			//记录音频json文件
			if(!audioList || audioList.length < 1){
				console.log('音频危险');					
				return;
			}
			fs.writeFile(audioListFile,JSON.stringify(audioList,null,4), "utf8",function(err2){
				if(err2){
					defered.reject(err);
				} else {
					defered.resolve('ok4');
				}
			});
		} catch(e){
			defered.reject(e);			
		}

	},200);
	return defered.promise;

}

function trueCloseHander(type){
	trueClose = true;


	   
	WordsService.closeDB();	
	if($scope.ctrl.newWin){
		$scope.ctrl.newWin.close();
	}


	$q.all([writeHistory(),writeAudioFile(),writeState()]).then(function(result){
			console.log(result);
			if(type == 'reload'){
				MainWindow.reload();
			} else {
				MainWindow.close();
			}
		},function(err){
			console.log(err);
			MainWindow.close();
			trueClose = false;	
		})
}
//百度ai speech
function aiSpeek(sentence,audioName){
	var AipSpeechClient = require("baidu-aip-sdk").speech;

	// 设置APPID/AK/SK
	var APP_ID = "11405723";
	var API_KEY = "nTrfKypNEi2n59hGCzy0oBcY";
	var SECRET_KEY = "EL3HrYAv2l8g3hq5TxnMX7rMCj0mkLp4";
	
	// 新建一个对象，建议只保存一个对象调用服务接口
	var client = new AipSpeechClient(APP_ID, API_KEY, SECRET_KEY);

	var filePathName = './assets/temp/' + audioName + '.mp3';

	//$scope.shell.isBusy = true;

	client.text2audio(sentence).then(function(result) {
		if (result.data) {
			var fs = require('fs');
			fs.writeFile(filePathName, result.data,function(err) {
				
			/* 	$scope.$apply(function(){  
					$scope.shell.isBusy = false;
				});  */	
				audioList.unshift(audioName);
				audioListCurrent.push(audioName);
		
				
				$scope.shell.setReady();
				$scope.shell.setLoading(false);
				
				if (err) {
					throw err;
				} else {
					$scope.ctrl.playAudio(filePathName);
				}                                   
				
			})			
		} else {
			// 服务发生错误
		/* 	$scope.$apply(function(){  
				$scope.shell.isBusy = false;
			});  */
			$scope.shell.setReady();
			console.log(result)
		}
	}, function(e) {
		// 发生网络错误
		console.log(e)
	});

}
function createWindow() {
	const {BrowserWindow} = require('electron').remote
	const path = require('path')

	if($scope.ctrl.newWin ){
		$scope.ctrl.newWin.show();
		return;
	}
	
	const modalPath = path.join('file://', app.sysConfig().paths.dirname + '/window.html')

	let win = new BrowserWindow({ title:'单词板',width: 300, height: 200,  transparent: true,frame: false,show: false ,alwaysOnTop:true})

	win.on('close', () => { win = null 
		$scope.ctrl.newWin = null;
		$scope.ctrl.stopPlay();

	})
	win.loadURL(modalPath)
	win.once('ready-to-show', () => {
		win.show()
	  })
	win.webContents.on('did-finish-load', () => {
		/* var mes = {title:'dd',meaning:'bb'};
		win.webContents.send('update-word', mes) */
		$scope.ctrl.autoPlayAll();
	})

	win.setPosition(1000,100)

	$scope.ctrl.newWin = win;
	

	


}
  }
  module.exports = WordsController
})()
