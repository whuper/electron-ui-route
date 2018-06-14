(function () {
  'use strict'
  /**
   * TodoDataService - description
   *
   * @param  {type} PouchDBService description
   * @return {type}                description
   */
  function WordsService($q) {
	  if(!db){
		/*
		var fs = require('fs');
		var SQL = require('sql.js');
		var filebuffer = fs.readFileSync('./assets/wenhaotest.db');
		// Load the db
		var db = new SQL.Database(filebuffer);
		*/
		var sql3 = require("sqlite3").verbose();
		var db = new sql3.Database('./assets/wenhaotest.db');

	  }

    return {      /**
       * initialize function - description
       *
       * @return {Promise}  description
       */
      initialize: function () {
        console.log('db initialize');
        return 'initialize';

      },
      getWordsList: function (query) {
		var defered = $q.defer();
		var start = (parseInt(query.page) - 1)  * query.limit;
		var sqlStr = `SELECT * FROM english limit ${start},${query.limit}`;
		db.all(sqlStr,function(err, rows){
			 if (err) defered.reject(err);

				defered.resolve(rows);		
		});
		return defered.promise;
		//db.close()        
        
      },
	  getWordsArray: function (wordsArray) {
		var defered = $q.defer();
		var tmstr = "'" + wordsArray.join("','") + "'";
		tmstr = tmstr.toLowerCase();
		var tmstr2 = wordsArray.join();
		tmstr2 = tmstr2.toLowerCase();

		var sqlStr = `SELECT id,words FROM dict where words in (${tmstr}) order by instr('${tmstr2}',words)`;
		//console.log('sqlStr',sqlStr);
        //var result = db.exec(sqlStr);
        db.all(sqlStr,function(err, rows){
			 if (err) defered.reject(err);
				defered.resolve(rows);		
		});
		return defered.promise;

      },
	  searchWords:function(txt,specific){
		var defered = $q.defer(),colum = 'words',table = 'english',limit = 15;

		if(specific){
			//精确查找
			var sqlStr = `SELECT * FROM ${table} where words = '${txt}'`;

		} else {
				//如果有中文字符
				var index = txt.search(/[\u4e00-\u9fa5]/);
				if(index != -1){
					colum = 'meaning';
					txt = '%' + txt + '%';
				} else {
					txt = txt + '%';		
				}
				var txt = txt.toLowerCase();
				var sqlStr = `SELECT * FROM ${table} where ${colum} like '${txt}' limit ${limit}`;
		}

			console.info('sqlStr',sqlStr);
			db.all(sqlStr,function(err, rows){
				if(rows && rows.length > 0){
					var res = {
					flag:table,
					list:rows
					}
					defered.resolve(res);		
				} else {
					console.log('没有搜索到结果,到dict中查找');
					table = 'dict';
					if(specific){
							//精确查找
							var sqlStr = `SELECT * FROM ${table} where words = '${txt}'`;
					} else {
							var sqlStr = `SELECT * FROM ${table} where ${colum} like '${txt}' limit ${limit}`;
					}					
					console.info('sqlStr',sqlStr);
						db.all(sqlStr,function(err, rows2){							
								var res = {
									flag:table,
									list:rows2
									}
							defered.resolve(res);
						});
				
				}
			});
		return defered.promise;
	  },
      get: function (docID) {
        return db.get(docID)
      },

      save: function (doc) {
        if (!doc._id) {
          doc._id = uuid.v4()
        }
        return saveDoc(doc)
      },
      delete: function (doc) {
        return db.remove(doc)
      },
	  closeDB:function(){
		  db.close();
	  }
    }
  }
  module.exports = WordsService
})()
