'use strict';

import gulp from "gulp";
import taskList from "gulp-task-listing";
import conf from "./gulp/conf";
import read from "fs-readdir-recursive";

/**
 *  This will load all js or coffee files in the gulp directory
 *  in order to load all gulp tasks
 */

read('./gulp', function(file){
  return (/\.(js|coffee)$/i).test(file);
}).map( file => {
  require('./gulp/' + file);
});

/**
 *  Default task clean temporaries directories and launch the
 *  main optimization build task
 */
gulp.task('default', () => {
  //environments.current(conf.environments.local);
  conf.environment = 'local';
  gulp.start('node-server');
});

gulp.task('help', taskList);

//
gulp.task('bundle', ['clean_dist_server'], () => {
  conf.environment = 'production';
  gulp.start('dist_server');
});
