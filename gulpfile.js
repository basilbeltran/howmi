var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('gTest', function() {
  var error = false;
  gulp.
    src('./tests/test.js').
  //src('./movieTest.js').
    pipe(mocha()).
    on('error', function() {
      console.log('Tests failed - unskillfull student !');
      error = true;
    }).
    on('end', function() {
      if (!error) {
        console.log('Tests succeeded! Enter the below code:\n' +
          require('fs').readFileSync('./output.dat'));
        process.exit(0);
      }
    });
});

gulp.task('gWatch', function() { 
	gulp.watch(['./scripts/*', './tests/*'], ['gTest']); 
  });
//gulp.task('gulp-watch', function() { gulp.watch(['./mongo-schemas/course.js', './mongo-schemas/student.js'], ['test']);   });
