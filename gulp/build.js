'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var moment = require('moment');
moment().format();

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'uglify-save-license', 'del']
});

//Copy all server files and custom css files
gulp.task('copy', function() {
  var allFiles = [].concat(
    'api/**/*',
    'cli/**/*',
    'components/**/*',
    'config/**/*',
    'helpers/**/*',
    'middleware/**/*',
    'migrations/**/*',
    'routers/**/*',
    'routes/**/*',
    'utils/**/*',
    'views/**/*',
    'app.js',
    'package.json',
    './.babelrc'
  );
  return gulp.src(allFiles)
    .pipe($.debug({
      title: 'file:'
    }))
    .pipe($.copy(conf.paths.dist_server));
});


gulp.task('zip_server', ['copy'], function () {
  return gulp.src(path.join(conf.paths.dist_server, '/**/*'), {dot: true})
    .pipe($.zip('server.zip'))
    .pipe(gulp.dest('zip'));

});

gulp.task('clean_dist_server', function() {
  return $.del([path.join(conf.paths.dist_server, '/')]);
});

gulp.task('dist_server', function() {
  gulp.start('zip_server');
});
