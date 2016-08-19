var mongodb = require('mongodb');
var muri_mlab1 = 'mongodb://fuser:password1@ds017165.mlab.com:17165/foenix_db1'
var muri_mlab2 = 'mongodb://fuser2:mongodb777@ds017165.mlab.com:17165/foenix_db1'
var muri_local_movies = 'mongodb://localhost:27017/movies';
var muri_local_example = 'mongodb://localhost:27017/example';

var uri = muri_local_example;


module.exports = function(callback) {
  mongodb.MongoClient.connect(uri, callback);
};
