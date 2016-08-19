

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

var app = express();

app.use(express.static(__dirname + '/public'));
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

var server = app.listen(port, () => {
    console.log('Server up!', port);
});

//  var connect = require('./connectMongo'); // edx m101
//  require ("./testMongo/app.js")(app);  //cs5610

var db
const MongoClient = require('mongodb').MongoClient; // mongodb://fuser2:<mongodb777>@ds017165.mlab.com:17165/foenix_db1
MongoClient.connect('mongodb://localhost:27017/example', (err, database) => {
  if (err) {
    console.log(error);
  }
  db = database

  database.collection('sample').insert({ myKey: "YESSS!" }, function(error, result) {
    if (error) {
      console.log(error);
    }
  });

});




var socketServer = io(server);
socketServer.on('connection', (socket) => {  // socketServer for broadcast,  socket to individual

    socket.on('healthCheck', (ping) => {
      //console.log("Server got ping");
      socketServer.emit('healthResponse', Math.random());
    });

// The browser has sent a statsObj
    socket.on('stats', (stats) => {
      console.log(JSON.stringify(stats, null, 2) );
    });
});
