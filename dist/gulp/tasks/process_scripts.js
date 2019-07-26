(function() {
    'use strict';

    /**
    * Basics
    */
    var fs = require('fs');
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
    $.rename     = require('gulp-rename');
    $.wrapJS     = require("gulp-wrap-js");
    $.sourcemaps = require('gulp-sourcemaps');
    $.uglify     = require('gulp-uglify');
    $.livereload = require('gulp-livereload');
    $.notify     = require('gulp-notify');
    $.util       = require('gulp-util');
    $.babel      = require('gulp-babel');


    /**
    * Copy vendors
    */
    gulp.task('_g_js_copy_vendors', false, function() {
        let k = 0
        return gulp.src(config.scripts.vendor.files)
               .pipe($.foreach(function(stream, file) {
                   return stream
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
                        prefix: (k++).toString()
                    }))
                    .pipe(gulp.dest(config.scripts.vendor.dest))
               }))
                .pipe($.gulpif((argv.notify), $.notify({
                    message : '✅ Scripts vendors copied',
                    title   : config.projectName + ' (Gulp)',
                    onLast  : true
                })));
    });

    /**
    * Concat JS files
    */
    gulp.task('_g_js_concat', false, function () {
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
            .pipe($.foreach(function(stream, file){
                return stream
                    .pipe($.wrapJS(config.scripts.wrap))
            }))
            .pipe($.addsrc.prepend(config.scripts.vendor.dest + '**/*.js'))
            .pipe($.sourcemaps.init())
            .pipe($.babel({
                presets: ['@babel/preset-env']
            }))
            .pipe($.concat(config.scripts.internals.name))
            .pipe($.uglify())
            .pipe($.sourcemaps.write('.'))
            .pipe(gulp.dest(config.scripts.internals.dest))
            .pipe($.livereload({start: true}))
            .pipe($.gulpif(argv.notify, $.notify({
                message : '✅ JS build done',
                title   : config.projectName + ' (Gulp)',
                onLast  : true
            })))
            .on('end', function() {
                if (config.options.wordpress.active) {
                    try {
                        fs.writeFileSync(config.options.wordpress.fileName, config.options.wordpress.fileContent.replace('%timestamp%', new Date().getTime()));
                    } catch (error) {
                        // console.error('Error while writing WP Assets file: ' + error);
                        return false;
                    }
                }
                return true;
            });
    });

    /**
    * Task: 'gulp scripts'
    */
    gulp.task('scripts', 'Copy JS vendors, Lint & Build JS files then watch', function(callback){
        if (argv.nowatch) {
            if (argv._.includes('all')) {
                return runSequence(
                    '_g_js_copy_vendors',
                    '_g_js_concat',
                    callback
                );
            } else {
                return runSequence(
                    '_g_js_copy_vendors',
                    '_g_js_concat',
                    '_givebackprompt',
                    callback
                );
            }
        } else {
            return runSequence(
                '_g_js_copy_vendors',
                '_g_js_concat',
                '_g_watch_scripts',
                callback
            );
        }
    }, {
        options: {
            'nowatch': '└- does not watch files for modifications',
            'notify': '└- send desktop notification when task is finished'
        }
    });

    /**
    * Watch sequence task
    */
    gulp.task('_g_js_watch', false, function(callback) {
        $.util.log('[Watch] Scripts files modified.');
        return runSequence(
            '_g_js_concat',
            callback
        );
    });

    /**
    * Watch
    */
    gulp.task('_g_watch_scripts', false, function() {
        var watcher = gulp.watch(config.scripts.internals.src, ['_g_js_watch']);
        watcher.on('change', function(event) {
          $.util.log('[Watcher] File ' + $.util.colors.yellow(event.path) + ' was ' + $.util.colors.cyan(event.type) + ', running tasks...');
        });

        return watcher;
    });

})();