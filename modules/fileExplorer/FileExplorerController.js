(function () {
  'use strict'

  function FileExplorerController($scope, $state, $q, $mdBottomSheet, $mdDialog, $mdToast,$timeout,$log,$interval) {
    

	var fs = require('fs');
	
	var app = require('electron').remote.app;
	var appCfg = app.sysConfig();
	var configDir = app.getPath('userData');
	

	var system = appCfg.platform;
	var dbFile = '';
	
	console.log('system',system);
	/*if(system == 'darwin'){
		var curDirPath = 'D:/nodejs/electron/electron-ui-route/';
	}
	if(system == 'win32'){
		var curDirPath = 'D:/nodejs/electron/electron-ui-route/';
	}*/
	//Windows:C:\Users\username
	//Linux:/home/username
	//Mac OS X:/Users/username

	try {
			//获取自定义皮肤的配置
	var fs = require('fs');
	var jsonObj = JSON.parse(fs.readFileSync('./movies_data/config.json',"utf8"));

	}catch(error){
            console.log(error);
    }

	var os = require('os');
	var curDirPath = os.homedir() + '/';
	curDirPath = curDirPath.replace(/\\/g,'/');
    this.initialize = function () {

		$scope.curItemIndex = undefined;
		$scope.employee = 'obama';  
		$scope.imagePath = './assets/washedout.png';
		$scope.curDisk = '';
		$scope.showInit = false;
		$scope.curSel = 'localDir';

		$scope.dataPath = '';

		if(system == 'win32'){
			$scope.disklist = jsonObj.disklistWin;
			$scope.localDirlist = jsonObj.localDirWin;
		
		} else {
			$scope.disklist = jsonObj.disklistMac;
			$scope.localDirlist = [];
		}
	
		$scope.ctrl.changeDir();


	//init end
	};
	this.changeDir = function(path){
		if(!path){
			path = curDirPath;
		}
		$scope.ctrl.getCurDirFile(path).then(function(json){
		$scope.fileList = json;
		 var pathArray = curDirPath.split("/"); 
	

		  for(var i= pathArray.length-1; i>0;i--){
             if(pathArray[i] == "")
             {
                      pathArray.splice(i,1);
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
		/*if(path.length < 4){
		//path = path.substring(0,path.length-1);
		}*/
		$scope.ctrl.changeDir(path);
	};
	this.itemClick = function(item){
		var tmpPath = curDirPath + item[0];
		switch(item[1]){ 
			case 'blank':
				var {remote} = require('electron');
				var {shell} = remote;
				shell.openItem(tmpPath);
				break;
			case 'folder':
				$scope.ctrl.changeDir(tmpPath + '/');
				break;
			
			default:
				// code
		}

	}
	this.sysOpen = function(fpath){
		var {remote} = require('electron');
		var {shell} = remote;
		var os = require('os');

		//fpath = fpath.substring(0,fpath.length-1);
		fpath = fpath.replace(/\/$/,'');
		fpath = fpath.replace(/\//g, '\\')
		console.log(fpath);
			shell.showItemInFolder(fpath);
	
		//shell.openItem(path);
	
	};
	this.getCurDirFile = function(fullPath){
	
		var deferred = $q.defer();

		fs.readdir(fullPath, function(error, files) {
			if (error || !files) {
				   $mdDialog.show(
					  $mdDialog.alert()
						.title('Operation not permitted!')
						.textContent(error.path)
						.ok('OK')
					);
			  deferred.reject(error);			 
			} else {
					var filelist = [];
					for (var i = 0; i < files.length; i++) {
						if(files[i].indexOf('Sys') == -1){
							var fileinfo = fs.statSync(fullPath + files[i]);
							
							if(fileinfo.isDirectory()){
								filelist.push([files[i],'folder',fileinfo])
							} else {
								filelist.push([files[i],'blank',fileinfo])
							}
						}
					};
					curDirPath = fullPath;
					deferred.resolve(filelist);			
			}

		  });

		return deferred.promise;
	
	};
	this.changesel = function(){
			//判断是否是本地的目录数组
		//curSel Array.isArray($scope.curDisk)
		if($scope.curSel == 'localDir') {
			$scope.dataPath = configDir.replace(/\\/g,'/') + '/movies_data/';
		} else {
			$scope.dataPath = $scope.curDisk + '/movies_data/';
		}
		console.log('$scope.curDisk',$scope.curDisk);
	
	},
	this.initDB = function(){

		if(!$scope.curDisk){
				 $mdDialog.show(
					  $mdDialog.alert()
						.textContent('没有选择磁盘')
						.ok('OK')
					);
			return;
		}
		var fs= require("fs");
	
		
		var mycommon = require('mycommon');

		console.log($scope.dataPath + 'thumbnails');
		mycommon.mkdirsSync($scope.dataPath + 'thumbnails');
		//mycommon.mkdirsSync('E:/movies_data/thumbnails/a/b/c');

		dbFile = $scope.dataPath + "movies.db";

		fs.exists(dbFile, function(exists) {  
			if(exists){
				 $mdDialog.show(
					  $mdDialog.alert()
						.textContent('数据库已经存在了')
						.ok('OK')
					);
			} else {
					var sqlite3 = require("sqlite3").verbose();
					var db = new sqlite3.Database(dbFile, function(e){
					 if (e) throw e;		
					});
					db.serialize(function() {
							db.run('CREATE TABLE porns (' +
									'id           INTEGER      PRIMARY KEY ,' +
									'name         VARCHAR (50),' +
									'country      VARCHAR (30),' +
									'actors       VARCHAR (50),' +
									'region       VARCHAR (40),' +
									'tags         TEXT,' +
									'mtime        VARCHAR (30),' +
									'filesize     DOUBLE (30),' +
									'cover        VARCHAR (30),' +
									'captures     TEXT,' +
									'satisfaction INTEGER (10),' +
									'year         INTEGER (10),' +
									'quality      VARCHAR (20),' +
									'filetype     VARCHAR (10),' +
									'mosaic       BOOLEAN,' +
									'parentsfolder		  VARCHAR(30),' +
									'path		  text,' +
									'md5		   VARCHAR(50),' +
									'ctime		   VARCHAR(30),' +
									'designation	VARCHAR(20),' +
									'cartoon      BOOLEAN)');
					});
					db.close();
			}
		
		});
	};
	this.scan = function(volume){
		volume = true;

		if(!$scope.curDisk){
			return false;		
		}

	 var confirm = $mdDialog.confirm()
          .title('Would you like to scan the hard disk?')
          .textContent($scope.curDisk)
          .ok('ok')
          .cancel('No');

		$mdDialog.show(confirm).then(function() {
			var rd = require('rd');
			var sql3 = require("sqlite3").verbose();
			var db = new sql3.Database(dbFile);

			//var filePattern = /^\w*\\.[mp4|rmvb|flv|mpeg|avi|mkv|rm]$/i;
			var filePattern = /\.(mp4|rmvb|flv|mpeg|avi|mkv|rm|wmv)$/i;
			//cacls "D:System Volume Information" /e /g everyone:f && rd /s /q "D:System Volume Information"

			//var timestamp = new Date().getTime();
			var startTimestamp = Date.parse(new Date())/1000;
			var stmt = db.prepare("INSERT  INTO porns (id,name,mtime,ctime,filesize,filetype,path,parentsfolder) VALUES (?,?,?,?,?,?,?,?)");
			//sql = 'update english set phonetic = ?,wordGroup = ?,example = ? where id = ?'
			//sql = "insert into lesson_info values ('%s', '%s','%s','%s','%s','%s')" % (name, link, des, number, time, degree)
			//// 将值封装为一个数组传值.
			//db.run("UPDATE tbl SET name = ? WHERE id = ?", [ "bar", 2 ]);

			// 异步遍历目录下的所有文件
			rd.eachFileFilter($scope.curDisk,filePattern,function (f, s, next) {
			  // 每找到一个文件都会调用一次此函数
			  // 参数s是通过 fs.stat() 获取到的文件属性值
		
			  var filefullPath = f.replace(/\\/g,'/');
			  var arr = filefullPath.split('/');
			
				var filename = arr[arr.length - 1];

				var path = filefullPath.replace(filename,'');
				//去掉盘符
				if(volume){
					path = path.replace(/^\w:/i,'');
				}
				var parentsfolder = arr[arr.length - 2];
				var ctime = Date.parse(s.ctime)/1000
				var mtime = Date.parse(s.mtime)/1000
				var filesize = s.size;
				var filetype = filename.substring(filename.lastIndexOf(".")+1);
				console.log('filename',filename);
				stmt.run(null,filename,mtime,ctime,filesize,filetype,path,parentsfolder);
				next();

			}, function (err) {
			  if (err) throw err;
			  // 完成
			  console.log('startTimestamp',startTimestamp);
			  var endTimestamp = Date.parse(new Date())/1000;
				var timeLong = (endTimestamp - startTimestamp);
				console.log('总耗时' + timeLong + '秒');
				stmt.finalize();
				db.close();
			});
		 
		}, function() {
			console.log('已取消');
		});

	/*


		*/
		
	
	
	};
	this.browse = function(){
		var sql3 = require("sqlite3").verbose();
		var db = new sql3.Database('./movies.db');
		db.all("SELECT * from porns", function(err, rows) {

			$scope.movieList = rows;
			console.log('rows',rows);
		
		});
		db.close();

	
	
	};
	this.userDir = function(item){	
		//const shell = require('electron').shell
		var {remote} = require('electron');
		var {shell} = remote;
		var os = require('os');
		//console.log('os.homedir',os.homedir());
		//C:\\Users\\Administrator
		//e:\\BaiduYunDownload\\DM王朝1566.2007.46集全
		if(!item){
				shell.showItemInFolder(configDir);
		} else {
				shell.showItemInFolder(item);
		}
	
	},
	this.showItem = function(item){
			
	
	},
	this.thumTojpg = function(filepath,filename){
		var ffmpeg = require('fluent-ffmpeg');
		var fullpath = filepath + filename;
		console.log(fullpath);
		/*
		videoToJpeg(input)
		.then(output=>{}
		)
		.catch(err=>console.error(err));
		*/
		ffmpeg(fullpath)
		  .screenshots({
			timestamps: ['10%','20%','40%'],
			filename: '%b-at-%s-seconds.png',
			folder: './output'
			//size: '320x240'
		  });
	};

    // function end
	
	
	
  }
  module.exports = FileExplorerController
})()
