/*
 *  Inserts "doc" into the collection "movies".
 */
exports.insert = function(db, doc, callback) {
    db.collection('movies').insert({title:doc.title,
                                    year:doc.year,
                                    director:doc.director }, function(error, result) {
      if (error) { console.log(error) };
      callback(error);
})

};

/*
 *  Finds all documents in the "movies" collection
 *  whose "director" field equals the given director,
 *  ordered by the movie's "title" field. See
 *  http://mongodb.github.io/node-mongodb-native/2.0/api/Cursor.html#sort
 */
exports.byDirector = function(db, director, callback) {

  db.collection('movies').find({"director":director}).sort({"title":1}).toArray(function(error, docs) {
    if (error) { console.log(error) };
    docs.forEach(function(doc) {  console.log(JSON.stringify(doc)) });
    callback(error, docs);
  })

};
