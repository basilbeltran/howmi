//XXX MODULE created as a function with object 'module' returned
//XXX onEvent() called from listeners

const pageWatch = (function() {
    "use strict";

    const module = {             //this is returned
        config: {

        },

        //TODO figure out how to identify the browserUUID ... what does cloud9 use?


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
        "sdLength":0,
        "mouseOutData":[["Time", "screenX", "screenY"]],
        "scrollData":[["Time", "Y-Offset", "Content Length"]]
        },


        getStats: function() {
          this.statsObj.modLength = this.statsObj.mouseOutData.length
          this.statsObj.sdLength = this.statsObj.scrollData.length
          return this.statsObj
        },

// crunch events and display stats to the web, send stats to server
        report: function() {
//console.log( this.statsObj  );  // dump events to console for development purposes.

          console.log("Visit time so far : "
            + (new Date().getTime() - this.statsObj.firstViewTime) +" milliseconds");


          //XXX send stats to the server
          socket.emit( 'stats', this.getStats() );


          pd.drawMouseOutGoog(this.statsObj.mouseOutData);
          pd.drawScrollGoog(this.statsObj.scrollData);

//             let localMouseOutData = this.statsObj.mouseOutData //NOTE WHY do I need to get this vbl?
//             let localScrollData = this.statsObj.scrollData     // WHY ...  why...  w.. ?
//
//             google.charts.setOnLoadCallback( drawStats );  //https://developers.google.com/chart/interactive/docs/gallery/linechart
//
//             function drawStats() {
//               let googTableData = google.visualization.arrayToDataTable(localMouseOutData);
//               let options = {title: 'MOUSE events', curveType: 'function',legend: { position: 'bottom' } };
//               let chart = new google.visualization.LineChart(document.getElementById('chart_div_1'));
//               chart.draw(googTableData, options);
//
// //console.log(JSON.stringify(localScrollData, null, 2))
//                googTableData = google.visualization.arrayToDataTable(localScrollData);
//                options = {title: 'SCROLL events', curveType: 'function',legend: { position: 'bottom' } };
//                let chart2 = new google.visualization.LineChart(document.getElementById('chart_div_2'));
//                chart2.draw(googTableData, options);
//             }

        }, // end report function



          onEvent: function(event) {
            // all the extraction in one place

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
              }


    };
    return module;

});
module.exports = pageWatch;
