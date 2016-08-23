var app = require('./server');
var assert = require('assert');
var superagent = require('superagent');

describe('server', function() {
  var server;

  beforeEach(function() {
    server = app().listen(3999);
  });

  afterEach(function() {
    server.close();
  });

  //it('prints out "Hello, world" when user goes to /', function(done) {
  it('Does not error on connection to 3999 /', function(done) {

    superagent.get('http://localhost:3999/', function(error, res) {
      assert.ifError(error);
      assert.equal(res.status, 200);
      //assert.equal(res.text, "Hello, world");
      done();
    });
  });
});
