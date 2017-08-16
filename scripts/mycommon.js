'use strict'
	var fs = require('fs');
	var path = require('path');
// 创建所有目录
function mkdirs(dirpath, mode, callback) {
    fs.exists(dirpath, function(exists) {
        if(exists) {
                //callback(dirpath);
				console.log(dirpath + ' exists');
        } else {
                //尝试创建父目录，然后再创建当前目录
                mkdirs(path.dirname(dirpath), mode, function(){
                        fs.mkdir(dirpath, mode, callback);
                });
        }
    });
};

exports.mkdirs = mkdirs;

exports.test = function(){

return '111';
};

