(function () {
    'use strict';

    module.exports = {
        'projectName': 'GUICHET',
        'options': {
            'wordpress': {
                'active': false,
                'fileName': 'assets-version.php',
                'fileContent': '<?php return \'%timestamp%\'; ?>'
            }
        },
        'styles': {
            'sass': {
                'src'         : 'sass/**.scss',
                'dest'        : 'css',
                'outputStyle' : 'expanded'
            },
            'autoprefixer': {
                browsers: ['last 2 versions', 'ie >= 10'],
                cascade: false
            },
            cleancss: {},
            'vendor' : {
                'files': [],
                'dest': 'sass/vendor/'
            }
        },
        'scripts': {
            'wrap': '(function($, window, document) {%= body %})(window.jQuery, window, document);',
            'internals': {
                'src': ['js/internals/*'],
                'dest': 'js',
                'name': 'common.js'
            },
            'vendor': {
                'files': [
                    // 'node_modules/jquery/dist/jquery.js'
                ],
                'dest': 'js/vendor/'
            }
        },
        'images': {
            'src': 'img/',
            'watch': 'img/src/'
        },
        'copy': {
            'files': {
                // 'path/to/**/*.svg': 'img/svg/'
            }
        }
    };
}());
