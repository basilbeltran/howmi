
var pageWatch = require('./pageWatch');

socket = io();
pw = new pageWatch;
pw.init();
const tick = setInterval(function(){ pw.ticker() }, 1000); // DONT KNOW HOW TO REFERENCE ticker from inside pageWatcher

// for debugging socket.io
//console.dir(socket)
// setInterval(function(){
//   //console.log('sending ping')
//   socket.emit( 'inquiry',
//               {
//                 "inqTime": new Date().getTime(),
//                 "visitTime": pw.statsObj.firstViewTime,
//                 "UUID":localStorage.getItem("browserUUID"),
//                 "state": "PING"
//               })
// }, 4000);




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


window.onscroll = function(event) {
  pw.onScroll(event);
};

document.documentElement.addEventListener('mouseout', function(event){
  pw.onMouseOut(event);
}, true);

document.documentElement.addEventListener('change', function(event){
  pw.onChanges(event);
}, true);

document.documentElement.addEventListener('click', function(event){
  pw.onClick(event);
}, true);

window.onunload = function() {   // why is this getting called and why doesnt push work?
  //console.log(" WINDOW ONUNLOAD HAS BEEN CALLED")
  pw.shutdown();
};

window.onbeforeunload = function() {
  //console.log(" WINDOW **ONBEFOREUNLOAD** HAS BEEN CALLED")
  //pw.shutdown();
};

//END ----____
/*

*/
