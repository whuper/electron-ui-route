(function () {
  'use strict'
  /**
   * TodoDataService - description
   *
   * @param  {type} PouchDBService description
   * @return {type}                description
   */
  function WordsService() {
    var fs = require('fs');
    var SQL = require('sql.js');
    var filebuffer = fs.readFileSync('./assets/wenhaotest.db');
    // Load the db
    var db = new SQL.Database(filebuffer);
    return {      /**
       * initialize function - description
       *
       * @return {Promise}  description
       */
      initialize: function () {
        console.log('db initialize');
        return 'initialize';

      },
      /**
       * todos function - description
       *
       * @return {type}  description
       */
      getWordsList: function (query) {
        //  db.serialize(function () {         
		var start = (parseInt(query.page) - 1)  * query.limit;
		var sqlStr = `SELECT id , wordname ,desc FROM english limit ${start},${query.limit}`;
        var result = db.exec(sqlStr);
        // });
		//db.close()        
        console.log(result);
        return result[0]
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
	  closeDb:function(){
		  db.close();
	  }
    }
  }
  module.exports = WordsService
})()
