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
    $.addsrc     = require('gulp-add-src');
    $.gulpif     = require('gulp-if');
    $.foreach    = require('gulp-foreach');
    $.concat     = require('gulp-concat');
    $.plumber    = require('gulp-plumber');
    $.imagemin   = require('gulp-imagemin');
    $.notify     = require('gulp-notify');


    /**
    * Optimize images
    */
    gulp.task('_img_optimize', function() {
        return gulp.src(config.images.src + '**/*')
            .pipe($.plumber({
                errorHandler: function (error) {
                    console.error(error.message);
                    this.emit('end');
                }
            }))
            .pipe($.imagemin({
                progressive: true
            }))
            .pipe(gulp.dest(config.images.src))
            .pipe($.gulpif(argv.notify, $.notify({
                message : '✅ Images optimized',
                title   : config.projectName + ' (Gulp)',
                onLast  : true
            })));
    });

    /**
    * Complete task
    */
    gulp.task('_process_images', function(){
        runSequence(
            '_img_optimize'
        );
    });

    /**
    * Watch sequence task
    */
    gulp.task('_img_watch', function() {
        runSequence(
            '_img_optimize'
        );
    });

    /**
    * Watch
    */
    gulp.task('_watch_images', function() {
        return gulp.watch(config.images.src + '**/*', ['_img_watch']);
    });

})();