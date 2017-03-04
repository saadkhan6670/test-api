'use strict';

import gulp from 'gulp';
import nodemon from 'gulp-nodemon';
import eslint from 'gulp-eslint';
import path from 'path';
import _ from 'lodash';
import conf from './conf';

const lintConfig = {
  extends: "eslint:recommended",
  baseConfig: {
    parser: 'babel-eslint',
    ecmaFeatures: {
      modules: true
    }
  },
  rules: {
    "no-console":0,
    "no-control-regex": 2,
    "no-debugger": 2,
    "no-dupe-args": 2,
    "no-dupe-keys": 2,
    "no-duplicate-case": 2,
    "no-empty-character-class": 2,
    "no-ex-assign": 2,
    "no-extra-boolean-cast": 2,
    "no-extra-semi": 2,
    "no-func-assign": 2,
    "no-invalid-regexp": 2,
    "no-irregular-whitespace": 2,
    "no-negated-in-lhs": 2,
    "no-obj-calls": 2,
    "no-proto": 2,
    "no-unexpected-multiline": 2,
    "no-unreachable": 2,
    "use-isnan": 2,
    "valid-typeof": 2,
    "no-fallthrough": 2,
    "no-octal": 2,
    "no-redeclare": 2,
    "no-delete-var": 2,
    "no-undef": 2,
    "no-unused-vars": [2, {"args": "none"}],
    "no-mixed-requires": 2,
    "no-new-require": 2
  },
  envs: [
    'node', 'es6'
  ]
};

//register nodemon task
gulp.task('nodemon', () => {
  nodemon({
    script: 'app.js'
    , ext: 'js'
    , ignore: ["node_modules/**", "build/**", "zip/**", "gulp/**"]
}).on('restart', function onRestart(changedFiles) {
    if (_.isUndefined(changedFiles)) {
      return;
    }
    gulp.src(changedFiles)
      .pipe(eslint(lintConfig))
      .pipe(eslint.format())
  });
});

gulp.task('lint', () => {
  return gulp.src([path.join(conf.paths.server, '**/*.js')])
    .pipe(eslint(lintConfig))
    .pipe(eslint.format())
});

gulp.task('node-server', ['lint'], () => {
  gulp.start('nodemon');
});
