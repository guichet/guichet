(function() {
  'use strict';

  /**
   * Basics
   */
  var gulp = require('gulp');
  var requireDir = require('require-dir');
  var runSequence = require('run-sequence');
  var config = require('../config.js');
  var $ = {};

  /**
   * Gulp plugins
   */
  $.concat       = require('gulp-concat');
  $.plumber      = require('gulp-plumber');
  $.sass         = require('gulp-sass');
  $.sassLint     = require('gulp-sass-lint');
  $.cleanCSS     = require('gulp-clean-css');
  $.autoprefixer = require('gulp-autoprefixer');
  $.sourcemaps   = require('gulp-sourcemaps');
  $.notify       = require('gulp-notify');


  /**
   * Lint Sass files
   */
  gulp.task('sass_lint', function () {
    return gulp.src(config.styles.sass.src)
        .pipe($.sassLint())
        .pipe($.sassLint.format())
        .pipe($.sassLint.failOnError())
  });

  /**
   * Sass files
   */
  gulp.task('sass_compile', function() {
    return gulp.src(config.styles.sass.src)
        .pipe($.plumber({
            errorHandler: function (error) {
                console.error(error.message);
                this.emit('end');
            }
        }))
            .pipe($.sourcemaps.init())
                .pipe($.sass.sync({outputStyle: config.styles.sass.outputStyle}).on('error', $.sass.logError))
                .pipe($.autoprefixer(config.styles.autoprefixer))
                .pipe($.cleanCSS(config.styles.cleancss))
            .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest(config.styles.sass.dest));
  });

  /**
   *
   * Complete task
   *
   */
  gulp.task('process_styles', function(){
    runSequence(
      'sass_lint',
      'sass_compile'
    );
  });


  /**
   * Watch
   */
  gulp.task('sass_watch', function() {
    return gulp.watch(config.styles.sass.src, ['process_styles']);
  });

})();