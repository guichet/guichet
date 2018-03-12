(function() {
    'use strict';

    /**
    * Include Gulp & Tools
    */
    var gulp = require('gulp-help')(require('gulp'));
    var requireDir = require('require-dir');
    var runSequence = require('run-sequence').use(gulp);
    var argv = require('yargs').argv;

    var $ = {};


    /**
    * Plugins
    */
    $.taskListing = require('gulp-task-listing');
    $.util        = require('gulp-util');

    /**
    * Get some configuration files
    */
    var config = require('./gulp/config.js');

    /**
    * Load all gulp taks
    */
    var tasks = requireDir('./gulp/tasks', { recurse: true });

    /**
    * Task: 'default'
    * List all available tasks
    */
    gulp.task('default', 'List available tasks & subtasks', $.taskListing.withFilters(null, 'default'));


    /**
     * Task: '_givebackprompt'
     * End process and give back prompt if sub task does not
     */
    gulp.task('_givebackprompt', false, function() { process.exit(0) });


    /**
     * Task: '_nowwatching'
     * Echo watching files
     */
    gulp.task('_nowwatching', false, function() { $.util.log('Now watching files for changes…'); });

    /**
    * Task: 'gulp all'
    */
    gulp.task('all', 'Process Styles, Scripts and Images simultaneously', function(){
        if (argv.nowatch) {
            return runSequence(
                ['copyfiles', 'styles', 'scripts', 'images'],
                '_givebackprompt'
            );
        } else {
            return runSequence(
                ['copyfiles', 'styles', 'scripts', 'images'],
                '_nowwatching'
            );
        }
    }, {
        options: {
            'notify': '└- send desktop notification when task is finished'
        }
    });

})();
