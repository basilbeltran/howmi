const butil = (function() {
    "use strict";

    const module = {

      test: function(text) {
        console.log(text)
      },

      //XXX data munging http://learnjsdata.com/combine_data.html
      join: function(lookupTable, mainTable, lookupKey, mainKey, select) {
          var l = lookupTable.length,
              m = mainTable.length,
              lookupIndex = [],
              output = [];
          for (var i = 0; i < l; i++) { // loop through l items
              var row = lookupTable[i];
              lookupIndex[row[lookupKey]] = row; // create an index for lookup table
          }
          for (var j = 0; j < m; j++) { // loop through m items
              var y = mainTable[j];
              var x = lookupIndex[y[mainKey]]; // get corresponding row from lookupTable
              output.push(select(y, x)); // select only the columns you need
          }
          return output;
      },


    };
    return module;

});
module.exports = butil;
