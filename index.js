

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

var connect = require('./connectMongo');
//require ("./mongoTest/app.js")(app);
//var movies = require('./movies');
//var dbInterface = require('./interface');


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

//return app  }
