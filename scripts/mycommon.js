'use strict'
	var fs = require('fs');
	var path = require('path');

function mkdirsSync (dirpath, mode) { 
    try
    {
        if (!fs.existsSync(dirpath)) {
            var pathtmp;
            dirpath.split(/[/\\]/).forEach(function (dirname) {  //这里指用/ 或\ 都可以分隔目录  如  linux的/usr/local/services   和windows的 d:\temp\aaaa
                if (pathtmp) {
                    pathtmp = path.join(pathtmp, dirname);
                }
                else {
                    pathtmp = dirname;
                }
                if (!fs.existsSync(pathtmp)) {
                    if (!fs.mkdirSync(pathtmp, mode)) {
                        return false;
                    }
                }
            });
        }
        return true; 
    }
	catch(e)
    {
        console.error("create director fail! path " + dirpath +" errorMsg:" + e);        
        return false;
    }
}

//同步删除指定目录下的所前目录和文件,包括当前目录
function rmdirsSync(targetPath) {
    try{
        var files = [];
        if( fs.existsSync(targetPath) ) {
            files = fs.readdirSync(targetPath);
            files.forEach(function(file,index){
                var curPath = targetPath + "/" + file;
                if(fs.statSync(curPath).isDirectory()) { // recurse
                    if(!rmdirsSync(curPath)) return false;
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(targetPath);
        }
    }
	catch(e)
    {
        log.error("remove director fail! path=" + targetPath + " errorMsg:" + e);
        return false;
    }
    return true;
};

exports.mkdirsSync = mkdirsSync;

exports.test = function(){

return '111';
};

