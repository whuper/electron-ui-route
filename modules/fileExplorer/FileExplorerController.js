(function () {
  'use strict'

  function FileExplorerController($scope, $state, $q, $mdBottomSheet, $mdDialog, $mdToast,$timeout,$log,$interval) {
    

	var fs = require('fs');
	
	var app = require('electron').remote.app;
	var appCfg = app.sysConfig();
	var os = appCfg.platform;
	console.log('os',os);
	if(os == 'darwin'){
		var curDirPath = 'D:/nodejs/electron/electron-ui-route/';
	}
	if(os == 'win32'){
		var curDirPath = 'D:/nodejs/electron/electron-ui-route/';
	}

    this.initialize = function () {


		$scope.curItemIndex = undefined;
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
		console.log('path',path);
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
	this.sysOpen = function(path){
		var {remote} = require('electron');
		var {shell} = remote;
		var os = require('os')
		//shell.showItemInFolder(path);
		shell.openItem(path);
	
	
	};
	this.getCurDirFile = function(fullPath){
		if(fullPath){
			curDirPath = fullPath;
		}	
		var deferred = $q.defer();

		fs.readdir(curDirPath, function(error, files) {
			console.log('files',files);
			if (error) {
			  deferred.reject(error);			 
			}
			var filelist = [];
			for (var i = 0; i < files.length; i++) {
				if(files[i].indexOf('Sys') == -1){
					var fileinfo = fs.statSync(curDirPath + files[i]);
					
					if(fileinfo.isDirectory()){
						filelist.push([files[i],'folder',fileinfo])
					} else {
						filelist.push([files[i],'blank',fileinfo])
					}
				}
			};
			deferred.resolve(filelist);
		  });

		return deferred.promise;
	
	};
	this.initDB = function(){

		var fs= require("fs")  
		var dbFile = "./movies.db";
		fs.exists(dbFile, function(exists) {  
			if(exists){
				alert('数据库已经存在');
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
									'cartoon      BOOLEAN)');
					});
					db.close();
			}
		
		});
	};
	this.scan = function(){

		var rd = require('rd');
		var sql3 = require("sqlite3").verbose();
		var db = new sql3.Database('./movies.db');

		//var filePattern = /^\w*\\.[mp4|rmvb|flv|mpeg|avi|mkv|rm]$/i;
		var filePattern = /\.(mp4|rmvb|flv|mpeg|avi|mkv|rm)$/i;
		//cacls "D:System Volume Information" /e /g everyone:f && rd /s /q "D:System Volume Information"

		//var timestamp = new Date().getTime();
		var startTimestamp = Date.parse(new Date())/1000;

		//sql = 'update english set phonetic = ?,wordGroup = ?,example = ? where id = ?'
		//sql = "insert into lesson_info values ('%s', '%s','%s','%s','%s','%s')" % (name, link, des, number, time, degree)
		//// 将值封装为一个数组传值.
		//db.run("UPDATE tbl SET name = ? WHERE id = ?", [ "bar", 2 ]);

		// 异步遍历目录下的所有文件
		rd.eachFileFilter('e:/',filePattern,function (f, s, next) {
		  // 每找到一个文件都会调用一次此函数
		  // 参数s是通过 fs.stat() 获取到的文件属性值
	
		  var filefullPath = f.replace(/\\/g,'/');
		  var arr = filefullPath.split('/');
		
			var filename = arr[arr.length - 1];

			var path = filefullPath.replace(filename,'');
			var parentsfolder = arr[arr.length - 2];
			var ctime = Date.parse(s.ctime)/1000
			var mtime = Date.parse(s.mtime)/1000
			var filesize = s.size;
			var filetype = filename.substring(filename.lastIndexOf(".")+1);

			var stmt = db.prepare("INSERT  INTO porns (id,name,mtime,ctime,filesize,filetype,path,parentsfolder) VALUES (?,?,?,?,?,?,?,?)");
			console.log('filename',filename);
			stmt.run(null,filename,mtime,ctime,filesize,filetype,path,parentsfolder);
		  
			next();

		}, function (err) {
		  if (err) throw err;
		  // 完成
		  var endTimestamp = Date.parse(new Date())/1000;
			var timeLong = (endTimestamp - startTimestamp);
			console.log('总耗时' + timeLong + '秒');
			stmt.finalize();
			db.close();
		});
		
	
	
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
			timestamps: ['20%','40%'],
			filename: '%b-at-%s-seconds.png',
			folder: './output'
			//size: '320x240'
		  });
	};

	function videoToJpeg(input){
		var ffmpeg = require('fluent-ffmpeg');
		var exec = require('child_process').exec;
		var output = input+'.jpeg';
		var command = `ffmpeg -i ${input} -r 1 -s WxH -f image2 ${output} -vframes 1`;
		return new Promise((resolve,reject)=>{
			exec(command, (error, stdout, stderr) => {
			if(error) return reject(error);
			if(stderr) return reject(stderr);
			resolve(output);
			});
		})
	}



    // function end
	
	
  }
  module.exports = FileExplorerController
})()
