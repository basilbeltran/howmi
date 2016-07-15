require('cute-stack')('pretty');
var path = require('path');
var debug = require('debug');
var log = debug('server:log');
var info = debug('server:info');
var error = debug('server:error');

var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));  // configure a public directory to host static content

var bp = require('body-parser');
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

// require ("./test/app.js")(app);

var ipaddress = process.env.OPENSHIFT_NODEJS_IP;
app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 3001);   //set and OR

app.listen(app.get('port'), () => {              //only start if we have a db
  info('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>listening on '+app.get('port') )
});
