/*
 * grunt-rsync
 * https://github.com/maxdaten/grunt-rsync
 *
 * Copyright (c) 2012 Jan-Philip Loos
 * Licensed under the MIT license.
 */

module.exports = function (grunt) {
  'use strict';



  grunt.util = grunt.util || grunt.utils;

  grunt.registerMultiTask('rsync', 'Copy files to a (remote) machine with rsync.', function () {

    var done                = this.async(),
        exec                = require('child_process').exec,
        src                 = this.file.src,
        dest                = this.file.dest,
        // options
        dry                 = grunt.option('no-write'),
        host                = this.data.options.host || 'localhost',
        user                = this.data.options.user || 'getGitUser', // TODO system username or nothing?
        remoteBase          = this.data.options.remoteBase || '~',
        verbose             = grunt.option('verbose'),
        preserveTimes       = this.data.options.preserveTimes,
        preservePermissions = this.data.options.preservePermissions || true,
        compression         = this.data.options.compression || true,
        recursive           = this.data.options.recursive || true,
        additionalOptions   = this.data.options.additionalOptions || '';
    
    // setup the cmd
    var command = ['rsync'];

    // these flags must be set before the src/dest args

    if (recursive) {
      command.push('-r');
    }

    if (verbose) {
      command.push('-v');
    }

    if (preserveTimes) {
      command.push('-t');
    }
    
    if (preservePermissions) {
      command.push('-p');
    }

    if (compression) {
      command.push('-z');
    }

    if (dry) {
      command.push('--dry-run');
    }

    command.push(additionalOptions);

    // from this line on, the order of the args is relevant!


    // files to copy
    command.push(grunt.file.expand(src).join(' '));
    
    // destination to copy
    command.push(user+'@' + host + ':' + remoteBase);

    command = command.join(' ');

    grunt.log.writeln('executing: ' + command );
    grunt.log.write('starting transfer...: ');
    
    exec(command, function (err, stdout, stderr) {
      if (stdout) {grunt.log.writeln(stdout);}
      if (stderr) {grunt.log.writeln(stderr);}
    
      if (err) {
        grunt.fail.fatal(err);
        done(false);
      } else {
        grunt.log.ok();
        done(true);
      }
    });
  });
};
