module.exports = function (grunt) {
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

    scp: {
      deploy: {
        src: 'test/',
        options: {
          host: "test.mygnia.de",
          port: "22",
          user: "jloos",
          path: "~"
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