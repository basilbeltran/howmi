
const pageWatch = (function() {
    "use strict";


    const module = {             //this is returned below
        config: {
        },

//data is a collection of statsObj


// placeholder to test local storage. Not working yet.
        init: function(){
          localStorage.setItem("browserUUID", "123-abcd");
//TODO figure out how to identify the browserUUID
//  https://en.wikipedia.org/wiki/Device_fingerprint

          console.log("IN INIT");
          google.charts.load('current', {'packages':['corechart']});

          //console.log("READING LOCAL STORAGE")
          console.dir(localStorage.getItem("storedVisits"));

          console.dir("myValue is: " + localStorage.getItem("browserUUID"));

        },

// called by a setInterval timer below. Now dormant. Was used to increase the page size.
        ticker: function() {  // display something to the browser
          const d = new Date().toLocaleString();
          // $('body').append("<div>"+ d + " "+ window.pageYOffset +"</div>");  // mouse location would be cool here
        },

// the user is leaving the site. Add the event array to a local array of visits
        shutdown: function() {
          console.log("IN SHUTDOWN");  // HAVN'T SEEN THIS

          if (typeof(Storage) !== "undefined") {
              console.log("SHUTDOWN WRITES LOCAL STORAGE");
              this.data.push([{"visitTime":this.statsObj.firstViewTime, "stats":this.statsObj }])
              localStorage.setItem("storedVisits", this.data);
          } else {
              console.log("No Web Storage support");
          }
              console.dir(localStorage.getItem("storedVisits"));
        },

        data:[],

        statsObj: {
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

               // crunch events and display stats to the web
        report: function() {
          console.log("Visit time so far : "
            + (new Date().getTime() - this.statsObj.firstViewTime) +" milliseconds");

          // dump events to console for development purposes.
          console.log( this.statsObj  );

          // send stats to the server
          socket.emit( 'stats', this.getStats() );
          this.shutdown();


// functional programming expanded syntax
          //   let graphData = this.statsObj.events.filter(function(e) {
          //      e.type === "mouseout"
          //      });
          //   let reducer = function(accumulator, nextItem){
          //     accumulator.push( [/^[0-9]{2,}/.exec(nextItem.timeStamp)[0],
          // /[0-9]+:[0-9]+:[0-9]+/.exec( new Date() )[0]
          //                       nextItem.screenY,
          //                       nextItem.screenX ] )
          //     return accumulator
          //   }
          // console.dir( graphData.reduce(reducer, []) );

// or more succinctly
          // let localMouseOutData = this.statsObj.events
          //   .filter(nextItem => nextItem.type === "mouseout")
          //   .reduce((acc, nextItem) => {
          //            acc.push( [ Math.floor(nextItem.timeStamp),
          //                       nextItem.screenX,
          //                       nextItem.screenY ] )
          //     return acc
          //   }, [])


// Extract mouseout events from the EVENT collection (the mouseOut event parameters are available)
// store in statsObj in array format

            let localMouseOutData = this.statsObj.mouseOutData // WHY?
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
                    //code block
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


const pw = new pageWatch;
pw.init();
pw.statsObj.firstViewTime = new Date().getTime();
const tick = setInterval(function(){ pw.ticker() }, 1000); // DONT KNOW HOW TO REFERENCE ticker from inside pageWatcher




var socket = io();

angular.module('sockets', [])
  .controller('UpdateController', UpdateController)

function UpdateController($scope) {
  var upCtrl = this;
  upCtrl.updates = []

    socket.on('healthResponse', function(pong){
      //console.log("got a pong ")
      //console.dir(socket)

        upCtrl.updates.push( pong.key +'\n'+ pong.time );  // Error: [ngRepeat:dupes] is a problem to avoid
        $scope.$apply();
    });

    setInterval(function(){
        socket.emit( 'healthCheck',
                    {
                      "time":new Date().getTime(),
                      "UUID":localStorage.getItem("browserUUID")
                    })
        //console.log("sent a ping")
    }, 5000);
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
  //pw.shutdown();
  console.log(" WINDOW ONUNLOAD HAS BEEN CALLED")
};


//END ----____
/*

*/
