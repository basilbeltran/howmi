//XXX SOCKET.IO on the client side
socket = io();


//XXX BROWSERIFY      browserify -e pageWatcher.js -o frontEnd.js
//XXX this file is referenced in the cmd as the entry point. It calls the first "require"
//XXX outputs frontEnd.js which is referenced in simple.html <script src="frontEnd.js"></script>
//http://numbers.brighterplanet.com/2011/08/04/add-node-js-commonjs-style-require-to-client-side-javascript-with-browserify/

var pageWatch = require('./pageWatch');
var pageDraw = require('./pageDraw');

//XXX pageWatch MODULE OBJECT created
pw = new pageWatch;  //NOTE needed global after browserify
pd = new pageDraw;
pw.init();

//XXX use of setInterval
const tick = setInterval(function(){ pw.ticker() }, 1000);

//XXX event listeners for onscroll, mouseout, change, click, unload

window.onscroll = function(event) {
  pw.onEvent(event);
};

document.documentElement.addEventListener('mouseout', function(event){
  pw.onEvent(event);
}, true);

document.documentElement.addEventListener('change', function(event){
  pw.onEvent(event);
}, true);

document.documentElement.addEventListener('click', function(event){
  pw.onEvent(event);
}, true);

window.onunload = function() {   // why is this getting called and why doesnt push work?
  //console.log(" WINDOW ONUNLOAD HAS BEEN CALLED")
  pw.shutdown();
};

window.onbeforeunload = function() {
  //console.log(" WINDOW **ONBEFOREUNLOAD** HAS BEEN CALLED")
  //pw.shutdown();
};

//XXX ANGULAR module defined for to socket.io 'response' message from server
angular.module('sockets', [])
  .controller('UpdateController', UpdateController)


function UpdateController($scope) {
  var upCtrl = this;
  upCtrl.updates = []

    socket.on('response', function(pong){
      //console.log("got a pong "+ pong.key+" "+pong.time)
      //console.dir(socket)

        upCtrl.updates.push( pong.key +'\n'+ pong.time );  // avoid [ngRepeat:dupes]
        $scope.$apply();
    });
}
