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

//获取日期字符串
function getNowFormatDate() {
		var date = new Date();
		var seperator1 = "-";
		var seperator2 = ":";
		var month = date.getMonth() + 1;
		var strDate = date.getDate();

		var strHour = date.getHours();

		var strMinnute = date.getMinutes();

		if (month >= 1 && month <= 9) {
			month = "0" + month;
		}
		if (strDate >= 0 && strDate <= 9) {
			strDate = "0" + strDate;
		}

		if (strHour <= 9) {
			strHour = "0" + strHour;
		}
		if (strMinnute <= 9) {
			strMinnute = "0" + strMinnute;
		}

		var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
				+ " " + strHour + seperator2 + strMinnute
				+ seperator2 + date.getSeconds();
		return currentdate;
  }

  //去除殊字符串
function excludeSpecial(oldstr,replaceStr){
      if(!replaceStr){
        replaceStr = '';  
      }
     // 去掉转义字符  
    var newStr = oldstr.replace(/[\'\"\\\/\b\f\n\r\t]/g,replaceStr);  
    // 去掉特殊字符  
    var newstr2 = newStr.replace(/[\.\!\@\#\$\%\^\&\*\{\}\:\"\<\>\?]/g,replaceStr);
    // 去掉前后空格
    return newstr2.replace(/(^\s*)|(\s*$)/g, "");
    //所有空格    
    //var newstr3 = newstr2.replace(/\s+/g,replaceStr);
  }


exports.mkdirsSync = mkdirsSync;
exports.excludeSpecial = excludeSpecial;
exports.getNowFormatDate = getNowFormatDate;

exports.test = function(){

return '111';
};

