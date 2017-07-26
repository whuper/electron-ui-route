(function () {
  'use strict'
  /**
   * TodoDataService - description
   *
   * @param  {type} PouchDBService description
   * @return {type}                description
   */
  function WordsService() {
	  if(!db){
		var fs = require('fs');
		var SQL = require('sql.js');
		var filebuffer = fs.readFileSync('./assets/wenhaotest.db');
		// Load the db
		var db = new SQL.Database(filebuffer);
		console.log('new db obj');
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
        //  db.serialize(function () {         
		var start = (parseInt(query.page) - 1)  * query.limit;
		var sqlStr = `SELECT * FROM english limit ${start},${query.limit}`;
        var result = db.exec(sqlStr);
        // });
		//db.close()        
        return result[0]
      },
	  searchWords:function(txt){

		var sqlStr = `SELECT * FROM english where wordname like '%${txt}%' limit 15`;
        var result = db.exec(sqlStr);
		if(result && result[0]){		
			return result[0]['values'];  
		} else {
			return [];
		}
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
