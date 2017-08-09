(function () {
  'use strict'

  function FileExplorerController($scope, $state, $q, $mdBottomSheet, $mdDialog, $mdToast,$timeout,$log,$interval) {
    

	var fs = require('fs');
	var curDirPath = 'D:/nodejs/electron/electron-ui-route/';

    this.initialize = function () {
      $scope.employee = 'obama';  
      $scope.imagePath = './assets/washedout.png';
	  var imagePath = 'assets/60.jpeg';

	  console.log('###FileExplorerController');

	  
	
	/*var rd = require('rd');
	// 异步列出目录下的所有文件 __dirname
	rd.read('D:/nodejs/electron/electron-ui-route/modules', function (err, files) {
	  if (err) throw err;
	  // files是一个数组，里面是目录/tmp目录下的所有文件（包括子目录）
	  console.log(files);
	});*/
	  $scope.ctrl.changeDir();


	//init end
	};
	this.changeDir = function(path){

		console.log('path',path);

		$scope.ctrl.getCurDirFile(path).then(function(json){
		$scope.fileList = json;
		 var pathArray = curDirPath.split("/"); 
		
		  for(var i = 0 ;i < pathArray.length;i++){
             if(pathArray[i] == "")
             {
                      pathArray.splice(i,1);
                      i= i-1;
             }
			}	
		   $scope.pathList = pathArray;
	});

	
	};
	this.dirClick = function(dirname){
		var path = '';
		for (var i = 0; i < $scope.pathList.length; i++) {
			path += ($scope.pathList[i] + '/');
			if(dirname == $scope.pathList[i]){
				break;
			}
		};
		$scope.ctrl.changeDir(path);
	};
	this.getCurDirFile = function(fullPath){
		if(fullPath){
			curDirPath = fullPath;
		}	
		var deferred = $q.defer();

		fs.readdir(curDirPath, function(error, files) {
			if (error) {
			  console.log(error);
			  deferred.reject(error);			 
			}
			var filelist = [];
			for (var i = 0; i < files.length; i++) {
				
				if(fs.statSync(curDirPath + files[i]).isDirectory()){
					filelist.push([files[i],'folder'])
				} else {
					filelist.push([files[i],'blank'])
				}
			};
			deferred.resolve(filelist);
		  });

		return deferred.promise;
	
	};

   

    // function end
	
	
  }
  module.exports = FileExplorerController
})()
