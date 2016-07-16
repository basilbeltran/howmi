require('cute-stack')('pretty');

var debug = require('debug');
var mlog = debug('server:log');
var minfo = debug('server:info');
var merror = debug('server:error');

var path = require('path');
var fs = require('fs');
var assert = require('assert');


//FRONT END
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));  // configure a public directory to host static content
var bp = require('body-parser');
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));


var ipaddress = process.env.OPENSHIFT_NODEJS_IP;
app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 3001);   //set and OR

var connect = require('./connect');
// require ("./mongoTest/app.js")(app);

//APPLICATION
var movies = require('./movies');
var dbInterface = require('./interface');


app.listen(app.get('port'), () => {
  minfo('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>listening on '+app.get('port') )
});
