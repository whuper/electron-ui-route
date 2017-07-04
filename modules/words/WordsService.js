(function () {
  'use strict'
  /**
   * TodoDataService - description
   *
   * @param  {type} PouchDBService description
   * @return {type}                description
   */
  function WordsService() {
      var sqlite3 = require('sqlite3').verbose();
      var db = new sqlite3.Database('./assets/wenhaotest');

    return {
      /**
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
      getWordsList: function () {
        var wordlist = [];
        //  db.serialize(function () {         
          db.all("SELECT id as id, name as name ,desc as desc FROM english limit 10", function (err, row) {
            console.log(row.id + ": " + row.name);
            // wordlist.push(row);
            wordlist = row;
          });
        // });
        db.close();
        return wordlist
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
      }
    }
  }
  module.exports = WordsService
})()
