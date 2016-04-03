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
    gulp.task('_styles_copy_vendors', function() {
        return gulp.src(config.styles.vendor.files)
            .pipe($.plumber({
                errorHandler: function (error) {
                    console.error(error.message);
                    this.emit('end');
                }
            }))
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
    gulp.task('_sass_lint', function () {
        return gulp.src([config.styles.sass.src, '!'+config.styles.vendor.dest, '!'+config.styles.vendor.dest+'**'])
            .pipe($.sassLint())
            .pipe($.sassLint.format())
            .pipe($.sassLint.failOnError())
    });

    /**
    * Sass compile task
    */
    gulp.task('_sass_compile', function() {
        return gulp.src([config.styles.sass.src, '!'+config.styles.vendor.dest, '!'+config.styles.vendor.dest+'**'])
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
    gulp.task('_process_styles', function(){
        $.livereload.listen();
        runSequence(
            '_styles_copy_vendors',
            '_sass_lint',
            '_sass_compile'
        );
    });

    /**
    * Sass watch sequence task
    */
    gulp.task('_sass_watch', function() {
        $.util.log('[Watch] Styles files modified.');
        runSequence(
            '_sass_lint',
            '_sass_compile'
        );
    });

    /**
    * Watch
    */
    gulp.task('_watch_styles', function() {
        return gulp.watch([config.styles.sass.src, '!'+config.styles.vendor.dest, '!'+config.styles.vendor.dest+'**'], ['_sass_watch']);
    });

})();