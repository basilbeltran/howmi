
const pageDraw = (function() {
    "use strict";

    const module = {

        drawMouseOutGoog: function(mouseOutData) {

            google.charts.setOnLoadCallback( drawStats );
            function drawStats() {
              let googTableData = google.visualization.arrayToDataTable(mouseOutData);
              let options = {title: 'MOUSE events', curveType: 'function',legend: { position: 'bottom' } };
              let chart = new google.visualization.LineChart(document.getElementById('chart_div_1'));
              chart.draw(googTableData, options);
            }
        },

        drawScrollGoog: function(scrollData) {
            google.charts.setOnLoadCallback( drawStats );
            function drawStats() {
               let googTableData = google.visualization.arrayToDataTable(scrollData);
               let options = {title: 'SCROLL events', curveType: 'function',legend: { position: 'bottom' } };
               let chart2 = new google.visualization.LineChart(document.getElementById('chart_div_2'));
               chart2.draw(googTableData, options);
            }
        }

    };
    return module;

});
module.exports = pageDraw;
