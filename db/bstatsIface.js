/*
 *  Inserts "doc" into the browserStats collection
 */

 // ADDITIONAL INFO from connection: cookie, ip, machine
 //TODO research socket.io fields (issued, cookie)
 //TODO design browserPing document, model, schema
 // ping has
 // {
 //   "time":new Date().getTime() ),
 //   "UUID":localStorage.getItem("browserUUID")
 // }

exports.add = function(db, ping, socket, callback) {
        let now = new Date()
        let issued = socket.handshake.issued
        //IDEA what about firstViewTime

        let bstats = {
          "browserID": ping.UUID,
          "sentTime": ping.inqTime,
          "visitTime": ping.visitTime,
          "state": ping.state,
          "recievedDate": now,
          "address": socket.handshake.address,
          "issued": issued,
          "cookie": socket.handshake.headers.cookie,
          "referer": socket.handshake.headers.referer,
          "delta": now.getTime() - issued,
          "browserToServer": now.getTime() - ping.inqTime
          };

console.dir(bstats)

    db.collection('bstats').insertOne(bstats, function(error, result) {
      if (error) { console.log(error) };
      //callback(error, "results");
    })
};


/*
 *  Removes all documents in the bstats collection
 *  whose browserID equals the given value
 */
exports.removeLike = function(db, ping, callback) {
  db.collection('bstats').remove({"browserID": ping.UUID}, function(error) {
    if (error) {
      return done(error);
    }
  })
};
