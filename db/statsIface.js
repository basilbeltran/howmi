/*
 *  Inserts document into the visits collection
 */

exports.add = function(db, visit, callback) {

    db.collection('visits').insertOne(visit, function(error, result) {
      if (error) { console.log(error) };
      console.log("a visit was added")
    })
};


/*
 *  Removes all documents in the bstats collection
 *  whose browserID equals the given value
 */
exports.removeLike = function(db, stats, callback) {
  db.collection('visits').deleteMany({"browserUUID": stats.browserUUID,
                                  "firstViewTime": stats.firstViewTime}, function(error, result) {
    if (error) {  console.log("bad error "+ error); return done(error);    }
    console.log("a visit was removed:"+ result)
  })
};
