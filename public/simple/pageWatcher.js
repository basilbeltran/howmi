
const pageWatch = (function() {
    "use strict";


    const module = {             //this is returned below
        config: {
        },

        //TODO figure out how to identify the browserUUID
        //  https://en.wikipedia.org/wiki/Device_fingerprint
        init: function(){
          this.statsObj.browserUUID = "123-abcd"
          this.statsObj.firstViewTime = new Date().getTime();

          localStorage.setItem("browserUUID", this.statsObj.browserUUID);
          google.charts.load('current', {'packages':['corechart']});
          console.dir("browserUUID is: " + localStorage.getItem("browserUUID"));
          console.dir("firstViewTime is: " + this.statsObj.firstViewTime);

          socket.emit( 'inquiry',
                      {
                        "inqTime": new Date().getTime(),
                        "visitTime": pw.statsObj.firstViewTime,
                        "UUID":localStorage.getItem("browserUUID"),
                        "state": "init"
                      })
        },



        // called by a setInterval timer below.
        ticker: function() {  // display something to the browser
          const d = new Date().toLocaleString();
          $('body').append("<div>"+ d + " "+ window.pageYOffset +"</div>");
        },



        // the user is leaving the site.
        shutdown: function() {
          console.log("IN SHUTDOWN");  // HAVN'T SEEN THIS

          socket.emit( 'inquiry',
                      {
                        "inqTime": new Date().getTime(),
                        "visitTime": pw.statsObj.firstViewTime,
                        "UUID":localStorage.getItem("browserUUID"),
                        "state": "shutdown"
                      })


          if (typeof(Storage) !== "undefined") {
              //this.data.push([{"visitTime":this.statsObj.firstViewTime, "stats":this.statsObj }])
              //localStorage.setItem("storedVisits", this.data);
          } else {
              console.log("No Web Storage support");
          }
//TODO console.dir(localStorage.getItem("storedVisits"));
        },


        data:[],

        statsObj: {
        "browserUUID":null,
        "firstViewTime":null,
        "modLength":0,
        "mouseOutData":[["Time", "screenX", "screenY"]],
        "sdLength":0,
        "scrollData":[["Time", "Y-Offset", "Content Length"]]
        },


        getStats: function() {
          this.statsObj.modLength = this.statsObj.mouseOutData.length
          this.statsObj.sdLength = this.statsObj.scrollData.length
          return this.statsObj
        },

// crunch events and display stats to the web, send stats to server
        report: function() {
          console.log("Visit time so far : "
            + (new Date().getTime() - this.statsObj.firstViewTime) +" milliseconds");

          // dump events to console for development purposes.
          console.log( this.statsObj  );

          // send stats to the server
          socket.emit( 'stats', this.getStats() );


            let localMouseOutData = this.statsObj.mouseOutData // WHY do I need to get this vbl?
            let localScrollData = this.statsObj.scrollData     // WHY?

            google.charts.setOnLoadCallback( drawStats );  //https://developers.google.com/chart/interactive/docs/gallery/linechart

            function drawStats() {
              let googTableData = google.visualization.arrayToDataTable(localMouseOutData);
              let options = {title: 'MOUSE events', curveType: 'function',legend: { position: 'bottom' } };
              let chart = new google.visualization.LineChart(document.getElementById('chart_div_1'));
              chart.draw(googTableData, options);

//console.log(JSON.stringify(localScrollData, null, 2))
               googTableData = google.visualization.arrayToDataTable(localScrollData);
               options = {title: 'SCROLL events', curveType: 'function',legend: { position: 'bottom' } };
               let chart2 = new google.visualization.LineChart(document.getElementById('chart_div_2'));
               chart2.draw(googTableData, options);
            }
        }, // end report function



          onEvent: function(event) {
            // lets have all the munging in one place
            //let eventCopy = Object.create(event)   // a deep copy ? not ideal
            //let eventCopy = this.cloneDR(event)    // another "this" problem? Let's go real time

            switch(event.type) {
                case "mouseout":
                     this.statsObj.mouseOutData.push( [ Math.floor(event.timeStamp),
                                          event.screenX,
                                          event.screenY] )
                    break;
                case "scroll":
                    this.statsObj.scrollData.push( [ Math.floor(event.timeStamp),
                                         event.target.defaultView.pageYOffset,
                                         event.target.body.scrollHeight] )
                    break;
                case "click":
                    console.log('GOT click CASE')
                    break;
                case "change":
                    console.log('GOT change CASE')
                    break;
                    
                default:
                    console.log('GOT DEFAULT CASE')
            }
          },

          onMouseOut: function(event) {
            this.onEvent(event)

          },


          onChanges: function(event) {
            this.onEvent(event)
          },


          onClick: function(event) {
            this.onEvent(event)
          },


  // here is a case where metadata is collected with the "raw" data
  // decided not to use this at this point, its slowing me down,
  // in fact, I'm going to try a monolithic data object

          onScroll: function(event) {
            this.onEvent(event);
          //     const windowHeight = this.getWindowHeight();
          //     const docHeight = this.getDocHeight();
          //     const scrollPosition = this.getScrollPosition();
          //     const percentOfPage = this.getPercent(windowHeight, docHeight, scrollPosition);
          //     this.statsObj.scrollData.push({"gmtTime": new Date().getTime(),
          //                                   "scrollPosition": scrollPosition,
          //                                   "percentOfPage": percentOfPage,
          //                                   "windowHeight": windowHeight,
          //                                   "docHeight": docHeight,
          //                                   "event": event
          //                         })
          //  return percentOfPage;
          },


  //im not using these at the moment
          getPercent: function(windowHeight, docHeight, scrollPosition) {
              const result = ((scrollPosition + windowHeight) / docHeight) * 100;
              return Math.floor(result);
          },

          getScrollPosition: function() {
              return (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
          },

          getWindowHeight: function() {
              return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0;
          },

          getDocHeight: function() {
              return Math.max(
                  document.body.scrollHeight || 0,
                  document.documentElement.scrollHeight || 0,
                  document.body.offsetHeight || 0,
                  document.documentElement.offsetHeight || 0,
                  document.body.clientHeight || 0,
                  document.documentElement.clientHeight || 0
              );
          }

    };
    return module;
});








var socket = io();
const pw = new pageWatch;
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
