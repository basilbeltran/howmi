var assert = require('assert');
var connect = require('../connectMongo');
var dbInterface = require('../db/bstatsIface');
var movies = require('./movies');

/**
 *  This test suite is meant to be run through gulp (use the `npm run watch`)
 *  script. It will provide you useful feedback while filling out the API in
 *  `interface.js`. You should **not** modify any of the below code.
 */
describe('dbInterface', function() {
  var db;
  var succeeded = 0;
  var georgeLucasMovies;

  /**
   *  This test ensures that bstatsIface.js' `insert()` function properly inserts
   *  a document into the "bstats" collection.
   */
  it('can insert a bstat', function(done) {
    let doc = {
      "browserID": "test-UUID",
      "sentDate": new Date(),
      "recievedDate": new Date(),
      "address": "33.244.234.12",
      "issued": new Date(),
      "cookie": 'io=mo3biwmdM0ydaI3QAAAA; connect.sid=s%3ABRXdRvQtDir5BWtfoLm87VtzWTKw3TaO.TFhavywKdGiRuR4AfZyjWdo%2FVHQsYJHp8YGYv6aBKEM; __ngDebug=true',
      "referer": 'http://localhost:1337/simple/simple.html',
      "delta": 234234234,
      "browserToServer": 2342342342
      };
//NOTE - I'm putting this aside. Need help. Don't understand how I to stub this.
// would I create a ping and socket object? What's the point?


    dbInterface.insert(db, doc, function(error) {
      assert.ifError(error);
      db.collection('movies').count({ title: 'Rogue One' }, function(error, c) {
        assert.ifError(error);
        assert.equal(c, 1);
        done();
      });
    });
  });

  /**
   *  This test ensures that interface.js' `byDirector()` function can load a
   *  single document.
   */
  it('can query data by director', function(done) {
    dbInterface.byDirector(db, 'Irvin Kershner', function(error, docs) {
      assert.ifError(error);
      assert.ok(Array.isArray(docs));
      assert.equal(docs.length, 1);
      assert.equal(docs[0].title, 'The Empire Strikes Back');
      ++succeeded;
      done();
    });
  });

  /**
   *  This test ensures that interface.js' `byDirector()` function loads
   *  movies in ascending order by their title. That is, "Attack of the Clones"
   *  comes before "The Phantom Menace", at least in lexicographic order.
   */
  it('returns multiple results ordered by title', function(done) {
    dbInterface.byDirector(db, 'George Lucas', function(error, docs) {
      assert.ifError(error);
      assert.ok(Array.isArray(docs));
      assert.equal(docs.length, 4);
      assert.equal(docs[0].title, 'Attack of the Clones');
      assert.equal(docs[1].title, 'Revenge of the Sith');
      assert.equal(docs[2].title, 'Star Wars');
      assert.equal(docs[3].title, 'The Phantom Menace');
      docs.forEach(function(doc) {
        delete doc._id;
      });
      assert.deepEqual(Object.keys(docs[0]), ['title', 'year', 'director']);
      ++succeeded;
      georgeLucasMovies = docs;
      done();
    });
  });

  /**
   *  This function does some basic setup work to make sure you have the correct
   *  data in your "movies" collection.
   */
  before(function(done) {
    connect(function(error, conn) {
      if (error) {
        return done(error);
      }
      db = conn;
      db.collection('movies').remove({}, function(error) {
        if (error) {
          return done(error);
        }

        var fns = [];
        movies.movies.forEach(function(movie) {
          fns.push(function(callback) {
            dbInterface.insert(db, movie, callback);
          });
        });
        require('async').parallel(fns, done);
      });
    });
  });

  /**
   *  The below code generates the answer code that we will use to
   *  verify you got the correct answer. Modifying this code is a
   *  violation of the honor code.
   */
  after(function(done) {
    if (succeeded >= 2) {
      //var _0xc3a0=["\x74\x65\x73\x74","\x6C\x65\x6E\x67\x74\x68","\x2E\x2F\x6F\x75\x74\x70\x75\x74\x2E\x64\x61\x74","\x74\x68\x65\x20\x6D\x65\x61\x6E\x20\x73\x74\x61\x63\x6B\x20\x61\x77\x61\x6B\x65\x6E\x73","\x77\x72\x69\x74\x65\x46\x69\x6C\x65\x53\x79\x6E\x63","\x66\x73"];var x={};x[_0xc3a0[0]]=georgeLucasMovies[_0xc3a0[1]];require(_0xc3a0[5])[_0xc3a0[4]](_0xc3a0[2],x[_0xc3a0[0]]===4&&_0xc3a0[3]);
      db.close(done);
    } else {
      db.close(done);
    }
  });
});
