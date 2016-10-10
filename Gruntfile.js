'use strict';

var request = require('request');

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    var reloadPort = 35729, files;

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        env : {
            dev : {
                src : 'dev.env'
            },
            prod: {
                src: 'prod.env'
            },
            stage: {
                src: 'stage.env'
            }
        },
        develop: {
            server: {
                file: 'app.js'
            }
        },
        concat: {
            dist: {
                src: [
                    'app/routes/**/*.scss',
                ],
                dest: '.sass-cache/build.scss',
            }
        },
        sass: {
            options: {
                outputStyle: 'compressed',
                sourceMap: true
            },
            dist: {
                files: {
                    'app/assets/rendered/style.css': '.sass-cache/build.scss'
                }
            }
        },
        watch: {
            options: {
                nospawn: true,
                livereload: reloadPort
            },
            js: {
                files: [
                    'app.js',
                    'app/**/*.js',
                    'config/*.js'
                ],
                tasks: ['develop', 'delayed-livereload']
            },
            vue: {
                files: [
                    'app/**/*.vue'
                ],
                tasks: ['develop', 'delayed-livereload']
            },
            css: {
                files: [
                    'app/routes/**/*.scss',
                    'app/assets/**/*.scss'
                ],
                tasks: ['concat','sass'],
                options: {
                    livereload: reloadPort
                }
            },
            views: {
                files: [
                    'app/routes/*.pug',
                    'app/routes/**/*.pug'
                ],
                tasks: ['delayed-livereload']
            }
        }
    });

    grunt.config.requires('watch.js.files');
    files = grunt.config('watch.js.files');
    files = grunt.file.expand(files);

    grunt.registerTask('delayed-livereload', 'Live reload after the node server has restarted.', function () {
        var done = this.async();
        setTimeout(function () {
            request.get('http://localhost:' + reloadPort + '/changed?files=' + files.join(','),  function(err, res) {
                var reloaded = !err && res.statusCode === 200;
                if (reloaded)
                grunt.log.ok('Delayed live reload successful.');
                else
                grunt.log.error('Unable to make a delayed live reload.');
                done(reloaded);
            });
        }, 500);
    });

    grunt.registerTask('default', [
        'env:dev',
        'concat',
        'sass',
        'develop',
        'watch'
    ]);

    grunt.registerTask('build', [
        'concat',
        'sass'
    ]);
};
