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

			console.log('rows',rows);
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

			console.log('rows',rows);
			defered.resolve(rows);		
		});
		return defered.promise;

      },
	  searchWords:function(txt){
		var defered = $q.defer();
		var txt = txt.toLowerCase();
		var sqlStr = `SELECT * FROM english where words like '%${txt}%' limit 15`;
		console.log('sqlStr',sqlStr);
			db.all(sqlStr,function(err, rows){
			 //if (err) defered.reject(err);
			 console.log('rows',rows);
			defered.resolve(rows);		
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
