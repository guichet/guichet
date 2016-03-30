(function() {
    'use strict';

    /**
    * Include Gulp & Tools
    */
    var gulp = require('gulp-help')(require('gulp'));
    var requireDir = require('require-dir');
    var runSequence = require('run-sequence');
    var $ = {};

    /**
    * Plugins
    */
    $.taskListing = require('gulp-task-listing');

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
    * Task: 'gulp styles'
    */
    gulp.task('styles', 'Copy CSS vendors, Lint & Compile Sass files then watch', function(){
        runSequence(
            '_process_styles',
            '_watch_styles'
        );
    }, {
        options: {
            'notify': '└- send desktop notification when task is finished'
        }
    });

    /**
    * Task: 'gulp scripts'
    */
    gulp.task('scripts', 'Copy JS vendors, Lint & Build JS files then watch', function(){
        runSequence(
            '_process_scripts',
            '_watch_scripts'
        );
    }, {
        options: {
            'notify': '└- send desktop notification when task is finished'
        }
    });

    /**
    * Task: 'gulp images'
    */
    gulp.task('images', 'Optimize images then watch', function(){
        runSequence(
            '_process_images'
        );
    }, {
        options: {
            'notify': '└- send desktop notification when task is finished'
        }
    });

    /**
    * Task: 'gulp all'
    */
    gulp.task('all', 'Process Styles, Scripts and Images simultaneously', function(){
        runSequence(
            ['styles', 'scripts', 'images']
        );
    }, {
        options: {
            'notify': '└- send desktop notification when task is finished'
        }
    });

})();