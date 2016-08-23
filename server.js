//IDEA how to uniquely identify the browser
//IDEA find and delete browserStats if info is repeated (same starttime)
//TODO finish edx and statsIface modules

//module.exports = function() {
//console.log(process.env);

  // var ipaddress = process.env.OPENSHIFT_NODEJS_IP;
  // app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 3001);   //set and OR


var port = process.env.PORT || 1337
    U = require('util')
    io = require('socket.io')
    fs = require('fs')
    bp = require('body-parser')
    path = require('path')
    express = require('express')
    assert = require('assert')

    debug = require('debug')
    mlog = debug('server:log')
    minfo = debug('server:info')
    merror = debug('server:error')
    require('cute-stack')('pretty')

var bstats = require('./db/bstatsIface');
var sstats = require('./db/sstatsIface');
var stats = require('./db/statsIface');


var app = express();

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

//START EXPRESS LISTENING
var server = app.listen(port, () => {
    console.log('Listen up!', port);
});

//CONNECT TO MONGO with mongodb.MongoClient
connect = require('./connectMongo')

// WRITE TO MONGO A SERVER UP    got null .... timing?
connect(function(error, conn) {  if (error) { console.log('Socket,io error', error) }
  db = conn;
  db.collection('sstats').insert({ serverStarted: Date() }, function(error, result) {
    if (error) {  console.log(error); }
  });
});


// START SOCKET.IO SERVER FOR BROWSERS TO CONNECT TO
var socketServer = io(server);    //TODO missing error handler on socket
socketServer.on('connection', (socket) => {  // socketServer for broadcast,  socket to individual
    console.log(Date()+" socketServer.on ");
    //console.dir(socketServer.eio.ws.options)    // examine socketServer object

    socket.on('inquiry', (ping) => {
      //console.log("server got a ping ")
      //console.dir(socket);                      // examine socket object
//IDEA this doesn't need to be a heartbeat, Enter and Leave describe a browsers visit


//TODO learn to write asynchronously and get rid of this setTimeout
setTimeout(function(){

        bstats.add(db, ping, socket, function(error, result) {
            if (error) {
              console.log(error)
            }
            console.log("howdy "+ result)  //NOTE  WHY DONT I SEE THIS ?
        });
        console.log("browser says howdy "+ ping.UUID)  
}, 5);


      //response BACK TO THE CLIENT WHO SENT THE inquiry
      // DO NOT USE THE EVENT NAME 'PING' its ***reserved***

      socket.emit('response', {
        key:  Math.random(),
        time: new Date().getTime()
      }); // random because ng-repeat hates "dupes"

    });




// recieved a stats from The browser
//TODO change stats naming to visit naming
    socket.on('stats', (visit) => {
      console.log("adding browserVisit: "+ visit.firstViewTime +" : "+ visit.browserUUID);

              stats.removeLike(db, visit, function(error, result) {
                  if (error) {
                    console.log(error)
                  }
                  console.log("removed previous visit "+ result)
              });

              //db.collection('browserStats').insert(visit);
              stats.add(db, visit, function(error, result) {
                  if (error) {
                    console.log(error)
                  }
                  console.log("howdy "+ result)  //NOTE  WHY DONT I SEE THIS ?
              });

    });
});
