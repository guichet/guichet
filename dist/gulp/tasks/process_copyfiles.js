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
    $.gulpif  = require('gulp-if')
    $.plumber = require('gulp-plumber');
    $.rename  = require('gulp-rename');
    $.notify  = require('gulp-notify');
    $.util    = require('gulp-util');
    $.merge   = require('merge-stream');


    /**
    * Simple files copy
    */
    gulp.task('_g_copy_files', false, function() {
        var streams = [];
        for (var srcFiles in config.copy.files) {
            streams.push(
                gulp.src(srcFiles)
                .pipe($.gulpif(argv.notify, $.plumber({
                    errorHandler: $.notify.onError(function(){
                        if (!argv.notify) {
                            return false;
                        }

                        return {
                            message: "‼️ Copy files error: <%= error.message %>",
                            title: config.projectName + ' (Gulp)',
                            emitError: false
                        }
                    })
                })))
                .pipe(gulp.dest(config.copy.files[srcFiles]))
                .pipe($.gulpif(argv.notify, $.notify({
                    message : '✅ Files copied',
                    title   : config.projectName + ' (Gulp)',
                    onLast  : true
                })))
            );
        }

        return $.merge(...streams);
    });



    /**
    * Task: 'gulp copyfiles'
    */
    gulp.task('copyfiles', 'Copy files', function(callback){
        return runSequence(
            '_g_copy_files',
            callback
        );
    }, {
        options: {
            'notify': '└- send desktop notification when task is finished'
        }
    });

})();
