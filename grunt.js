module.exports = function (grunt) {
  'use strict';
  grunt.loadTasks('./tasks');

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    test: {
      files: ['test/**/*.js']
    },
    lint: {
      files: ['grunt.js', 'tasks/**/*.js', 'test/**/*.js']
    },
    beautify: {
      files: '<config:lint.files>'
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'default'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true
      },
      globals: {
        exports: true
      }
    },

    rsync: {
      deploy: {
        files: ['test/test-files/one.txt', 'test/test-files/ddd/xyz.txt'],
        options: {
          host: "192.168.178.76",
          port: "22",
          user: "jloos",
          remoteBase: "~/grunt-rsync-test"
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-beautify');
  grunt.loadNpmTasks('grunt-bump');

  // Default task.
  grunt.registerTask('default', 'lint test');

  grunt.registerTask('tidy', 'beautify');

};