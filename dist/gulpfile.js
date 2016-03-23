(function() {
  'use strict';

  /**
  * Include Gulp & Tools
  */
  var gulp = require('gulp');
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
  gulp.task('default', $.taskListing.withFilters(null, 'default'));

  /**
  * Task: 'gulp styles'
  */
  gulp.task('styles', function(){
    runSequence(
      'process_styles',
      'sass_watch'
    );
  });

})();