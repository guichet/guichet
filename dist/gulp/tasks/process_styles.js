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
    $.gulpif       = require('gulp-if')
    $.concat       = require('gulp-concat');
    $.plumber      = require('gulp-plumber');
    $.rename       = require('gulp-rename');
    $.sass         = require('gulp-sass');
    $.sassLint     = require('gulp-sass-lint');
    $.cleanCSS     = require('gulp-clean-css');
    $.autoprefixer = require('gulp-autoprefixer');
    $.sourcemaps   = require('gulp-sourcemaps');
    $.livereload   = require('gulp-livereload');
    $.notify       = require('gulp-notify');
    $.util         = require('gulp-util');


    /**
    * Copy vendors
    */
    gulp.task('_g_styles_copy_vendors', function() {
        return gulp.src(config.styles.vendor.files)
            .pipe($.gulpif(argv.notify, $.plumber({
                errorHandler: $.notify.onError(function(){
                    if (!argv.notify) {
                        return false;
                    }

                    return {
                        message: "‼️ Sass vendors error: <%= error.message %>",
                        title: config.projectName + ' (Gulp)',
                        emitError: false
                    }
                })
            })))
            .pipe($.rename(function (path) {
                if (path.extname == '.css') {
                    path.extname = ".scss";
                }
                if (path.extname == '.scss' && !path.basename.startsWith('_')) {
                    path.basename = "_" + path.basename;
                }
                return path;
            }))
            .pipe(gulp.dest(config.styles.vendor.dest))
            .pipe($.gulpif(argv.notify, $.notify({
                message : '✅ Styles vendors copied',
                title   : config.projectName + ' (Gulp)',
                onLast  : true
            })));
    });


    /**
    * Lint Sass files
    */
    gulp.task('_g_sass_lint', function () {
        return gulp.src([config.styles.sass.src, '!'+config.styles.vendor.dest, '!'+config.styles.vendor.dest+'**'])
            .pipe($.gulpif(argv.notify, $.plumber({
                errorHandler: $.notify.onError(function(){
                    if (!argv.notify) {
                        return false;
                    }

                    return {
                        message: "‼️ Sass lint error: <%= error.message %>",
                        title: config.projectName + ' (Gulp)',
                        emitError: false
                    }
                })
            })))
            .pipe($.sassLint())
            .pipe($.sassLint.format())
            .pipe($.sassLint.failOnError())
    });

    /**
    * Sass compile task
    */
    gulp.task('_g_sass_compile', function() {
        return gulp.src([config.styles.sass.src, '!'+config.styles.vendor.dest, '!'+config.styles.vendor.dest+'**'])
            .pipe($.gulpif(argv.notify, $.plumber({
                errorHandler: $.notify.onError(function(){
                    if (!argv.notify) {
                        return false;
                    }

                    return {
                        message: "‼️ Sass compilation error: <%= error.message %>",
                        title: config.projectName + ' (Gulp)',
                        emitError: false
                    }
                })
            })))
                .pipe($.sourcemaps.init())
                    .pipe($.sass.sync({outputStyle: config.styles.sass.outputStyle}).on('error', $.sass.logError))
                    .pipe($.autoprefixer(config.styles.autoprefixer))
                    .pipe($.cleanCSS(config.styles.cleancss))
                .pipe($.sourcemaps.write('.'))
            .pipe(gulp.dest(config.styles.sass.dest))
            .pipe($.livereload())
            .pipe($.gulpif(argv.notify, $.notify({
                message : '✅ Sass compilation done',
                title   : config.projectName + ' (Gulp)',
                onLast  : true
            })));
    });

    /**
    * Complete task
    */
    gulp.task('_g_process_styles', function(){
        $.livereload.listen();
        runSequence(
            '_g_styles_copy_vendors',
            '_g_sass_lint',
            '_g_sass_compile'
        );
    });

    /**
    * Sass watch sequence task
    */
    gulp.task('_g_sass_watch', function() {
        runSequence(
            '_g_sass_lint',
            '_g_sass_compile'
        );
    });

    /**
    * Watch
    */
    gulp.task('_g_watch_styles', function() {
        var watcher = gulp.watch([config.styles.sass.src, '!'+config.styles.vendor.dest, '!'+config.styles.vendor.dest+'**'], ['_g_sass_watch']);
        watcher.on('change', function(event) {
          $.util.log('[Watcher] File ' + $.util.colors.yellow(event.path) + ' was ' + $.util.colors.cyan(event.type) + ', running tasks...');
        });

        return watcher;
    });

})();