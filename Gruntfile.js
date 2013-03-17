module.exports = function (grunt) {
  'use strict';
  grunt.loadTasks('./tasks');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    nodeunit: {
      all: ['test/*_test.js']
    },
    jshint: {
      files: ['grunt.js', 'tasks/**/*.js', 'test/**/*.js'],
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
    watch: {
      files: '<%= jshint.files %>',
      tasks: 'default'
    },

    rsync: {
      deploy: {
        src: 'test/fixures/**',
        options: {
          host: "192.168.178.76",
          port: "22",
          user: "jloos",
          remoteBase: "~/grunt-rsync-test"
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-bump');

  // Default task.
  grunt.registerTask('default', ['jshint', 'test']);
  grunt.registerTask('test', 'nodeunit');

};