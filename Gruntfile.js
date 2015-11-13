/*
 * scNuget
 * https://github.com/Brad-Christie/grunt-sitecore-nuget
 *
 * Copyright (c) 2015 Brad Christie
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    scNuget: {
      options: {
      },

      /*missing_src: {
        options: { }
      },
      invalid_src: {
        options: {
          src: '/a/b/c/d/e/f/g'
        }
      },
      missing_dest: {
        options: {
          src: 'test/sitecore',
          dest: '', // override default
        }
      },
      missing_ver: {
        options: {
          src: 'test/sitecore',
          ver: '' // override default
        }
      },
      invalid_version: {
        options: {
          src: 'test/sitecore',
          ver: 'abc'
        }
      },
      invalid_push_target: {
        options: {
          ver: '0.0.1',
          feed: 'http://nuget.org/'
        }
      },*/

      simple_package: {
        options: {
          src: 'test/sitecore',
          dest: 'tmp',
          ver: '8.1.151003'
        }
      },
      pack_and_push: {
        options: {
          src: 'test/sitecore',
          dest: 'tmp',
          ver: '8.1.150819',
          feed: {
            url: 'http://nuget.sitecore.local/',
            apiKey: 'EE6EC91406464D23B0E8040E45DBC0F5'
          }
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'scNuget', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
