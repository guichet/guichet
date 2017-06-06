(function() {
    'use strict';

    /**
    * Basics
    */
    var gulp = require('gulp');
    var requireDir = require('require-dir');
    var runSequence = require('run-sequence').use(gulp);
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
    $.util       = require('gulp-util');


    /**
    * Optimize images
    */
    gulp.task('_g_img_optimize', false, function() {
        return gulp.src(config.images.src + '**/*')
            .pipe($.gulpif(argv.notify, $.plumber({
                errorHandler: $.notify.onError(function(){
                    if (!argv.notify) {
                        return false;
                    }

                    return {
                        message: "‼️ Images optimization error: <%= error.message %>",
                        title: config.projectName + ' (Gulp)',
                        emitError: false
                    }
                })
            })))
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
    * Task: 'gulp images'
    */
    gulp.task('images', 'Optimize images then watch', function(callback){
        return runSequence(
            '_g_img_optimize',
            callback
        );
    }, {
        options: {
            'notify': '└- send desktop notification when task is finished'
        }
    });

    /**
    * Watch sequence task
    */
    gulp.task('_g_img_watch', false, function(callback) {
        $.util.log('[Watch] Images files modified.');
        return runSequence(
            '_g_img_optimize',
            callback
        );
    });

    /**
    * Watch
    */
    gulp.task('_g_watch_images', false, function() {
        return gulp.watch(config.images.watch + '**/*', ['_g_img_watch']);
    });

})();