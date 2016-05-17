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
    $.rename     = require('gulp-rename');
    $.wrapJS     = require("gulp-wrap-js");
    $.sourcemaps = require('gulp-sourcemaps');
    $.uglify     = require('gulp-uglify');
    $.livereload = require('gulp-livereload');
    $.notify     = require('gulp-notify');
    $.util       = require('gulp-util');


    /**
    * Copy vendors
    */
    gulp.task('_g_js_copy_vendors', function() {
        return Object.keys(config.scripts.vendor.files).forEach(function(key) {
            gulp.src(config.scripts.vendor.files[key])
            .pipe($.gulpif(argv.notify, $.plumber({
                errorHandler: $.notify.onError(function(){
                    if (!argv.notify) {
                        return false;
                    }

                    return {
                        message: "‼️ JS vendors error: <%= error.message %>",
                        title: config.projectName + ' (Gulp)',
                        emitError: false
                    }
                })
            })))
            .pipe($.rename({
                prefix: key
            }))
            .pipe(gulp.dest(config.scripts.vendor.dest))
            .pipe($.gulpif(argv.notify, $.notify({
                message : '✅ Scripts vendors copied',
                title   : config.projectName + ' (Gulp)',
                onLast  : true
            })));
        });
    });

    /**
    * Concat JS files
    */
    gulp.task('_g_js_concat', function () {
        return gulp.src(config.scripts.internals.src)
            .pipe($.gulpif(argv.notify, $.plumber({
                errorHandler: $.notify.onError(function(){
                    if (!argv.notify) {
                        return false;
                    }

                    return {
                        message: "‼️ JS Concat error: <%= error.message %>",
                        title: config.projectName + ' (Gulp)',
                        emitError: false
                    }
                })
            })))
            .pipe($.sourcemaps.init())
            .pipe($.foreach(function(stream, file){
                return stream
                    .pipe($.wrapJS(config.scripts.wrap))
            }))
            .pipe($.addsrc.prepend(config.scripts.vendor.dest + '**/*.js'))
            .pipe($.concat(config.scripts.internals.name))
            .pipe($.uglify())
            .pipe($.sourcemaps.write('.'))
            .pipe(gulp.dest(config.scripts.internals.dest))
            .pipe($.livereload())
            .pipe($.gulpif(argv.notify, $.notify({
                message : '✅ JS build done',
                title   : config.projectName + ' (Gulp)',
                onLast  : true
            })));
    });

    /**
    * Complete task
    */
    gulp.task('_g_process_scripts', function(){
        $.livereload.listen();
        runSequence(
            '_g_js_copy_vendors',
            '_g_js_concat'
        );
    });

    /**
    * Watch sequence task
    */
    gulp.task('_g_js_watch', function() {
        $.util.log('[Watch] Scripts files modified.');
        runSequence(
            '_g_js_concat'
        );
    });

    /**
    * Watch
    */
    gulp.task('_g_watch_scripts', function() {
        var watcher = gulp.watch(config.scripts.internals.src, ['_g_js_watch']);
        watcher.on('change', function(event) {
          $.util.log('[Watcher] File ' + $.util.colors.yellow(event.path) + ' was ' + $.util.colors.cyan(event.type) + ', running tasks...');
        });

        return watcher;
    });

})();