(function () {
    'use strict';

    module.exports = {
        'projectName': 'GUICHET',
        'styles': {
            'sass': {
                'src'         : './sass/**.scss',
                'dest'        : './css',
                'outputStyle' : 'expanded'
            },
            'autoprefixer': {
                browsers: ['last 2 versions', 'ie >= 10'],
                cascade: false
            },
            cleancss: {

            },
            'vendor' : []
        },
        'scripts': {
            'wrap': '(function($, window, document) {%= body %})(window.jQuery, window, document);',
            'internals': {
                'src': ['./js/internals/*'],
                'dest': './js',
                'name': 'common.js'
            },
            'vendor': []
        },
        'images': {
            'src': './img'
        }
    };
}());