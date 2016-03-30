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
    $.rename     = require('gulp-rename');
    $.wrapJS     = require("gulp-wrap-js");
    $.sourcemaps = require('gulp-sourcemaps');
    $.livereload = require('gulp-livereload');
    $.notify     = require('gulp-notify');


    /**
    * Copy vendors
    */
    gulp.task('_js_copy_vendors', function() {
        return gulp.src(config.scripts.vendor.files)
            .pipe($.plumber({
                errorHandler: function (error) {
                    console.error(error.message);
                    this.emit('end');
                }
            }))
            .pipe($.rename(function (path) {
                return path;
            }))
            .pipe(gulp.dest(config.scripts.vendor.dest))
            .pipe($.gulpif(argv.notify, $.notify('✅ ' + config.projectName + ' : Scripts vendors copied')));
    });

    /**
    * Concat JS files
    */
    gulp.task('_js_concat', function () {
        var files = [config.scripts.vendor.dest + '**/*.js'];;
            files.concat(config.scripts.internals.src);

        return gulp.src(files)
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
    * Watch sequence task
    */
    gulp.task('_js_watch', function() {
        runSequence(
            '_js_concat'
        );
    });

    /**
    * Complete task
    */
    gulp.task('_process_scripts', function(){
        runSequence(
            '_js_copy_vendors',
            '_js_concat'
        );
    });


    /**
    * Watch
    */
    gulp.task('_watch_scripts', function() {
        return gulp.watch(config.scripts.internals.src, ['_js_watch']);
    });

})();