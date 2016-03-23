(function() {
  'use strict';

  /**
   * Basics
   */
  var gulp = require('gulp');
  var requireDir = require('require-dir');
  var runSequence = require('run-sequence');
  var config = require('../config.js');
  var argv = require('yargs').argv;
  var $ = {};

  /**
   * Gulp plugins
   */
  $.gulpif     = require('gulp-if');
  $.foreach    = require('gulp-foreach');
  $.concat     = require('gulp-concat');
  $.plumber    = require('gulp-plumber');
  $.wrapJS     = require("gulp-wrap-js");
  $.sourcemaps = require('gulp-sourcemaps');
  $.livereload = require('gulp-livereload');
  $.notify     = require('gulp-notify');


  /**
   * Lint Sass files
   */
  gulp.task('js_concat', function () {
    return gulp.src(config.scripts.internals.src)
        .pipe($.plumber({
            errorHandler: function (error) {
                console.error(error.message);
                this.emit('end');
            }
        }))
        .pipe($.sourcemaps.init())
        .pipe($.foreach(function(stream, file){
            return stream
                .pipe($.wrapJS(config.scripts.wrap))
        }))
        .pipe($.concat(config.scripts.internals.name))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest(config.scripts.internals.dest))
        .pipe($.livereload())
        .pipe($.gulpif(argv.notify, $.notify('✅ ' + config.projectName + ' : JS processing')));
  });

  /**
   *
   * Complete task
   *
   */
  gulp.task('process_scripts', function(){
    runSequence(
      'js_concat'
    );
  });


  /**
   * Watch
   */
  gulp.task('js_watch', function() {
    return gulp.watch(config.scripts.internals.src, ['process_scripts']);
  });

})();