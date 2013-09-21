/*global module:false*/
module.exports = function(grunt) {


  // Project configuration.
  grunt.initConfig({
    rsync: {
      template: {
        files: { 'test-files' : '../test-files/'
               , 'other-dir' :  '../test-files/ddd/' },
        options: {
          host: '192.168.178.200',
          user: 'jloos',
          remoteBase: '/home/jloos/grunt-test-dir/'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-rsync-2');
  
  // Default task.
  grunt.registerTask('default', 'rsync');

};