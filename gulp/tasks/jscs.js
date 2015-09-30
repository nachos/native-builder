'use strict';

var jscs = require('gulp-jscs');
var config = require('../config');

module.exports = function (gulp) {
  gulp.task('jscs', ['jscs:lib', 'jscs:test', 'jscs:gulp']);

  gulp.task('jscs:lib', function () {
    return gulp.src(config.paths.lib)
      .pipe(jscs())
      .pipe(jscs.reporter())
      .pipe(jscs.reporter('fail'));
  });

  gulp.task('jscs:test', function () {
    return gulp.src(config.paths.test)
      .pipe(jscs())
      .pipe(jscs.reporter())
      .pipe(jscs.reporter('fail'));
  });

  gulp.task('jscs:gulp', function () {
    return gulp.src(config.paths.gulp)
      .pipe(jscs())
      .pipe(jscs.reporter())
      .pipe(jscs.reporter('fail'));
  });
};
