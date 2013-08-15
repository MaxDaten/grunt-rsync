/*
 * grunt-rsync
 * https://github.com/maxdaten/grunt-rsync
 *
 * Copyright (c) 2012 Jan-Philip Loos
 * Licensed under the MIT license.
 */

module.exports = function (grunt) {
  'use strict';

  function rsyncCallback(error, stdout, stderr) {
    grunt.log.writeln('stdout: ' + stdout);
    grunt.log.writeln('stderr: ' + stderr);

    grunt.log.writeln('err: ' + error);

    if (error) {
      //done(false);
      grunt.fail.fatal(error);
    }
  }


  function doRsync(cmd, user, host, remoteBase, target, files) {
    var exec = require('child_process').exec,
        src = grunt.file.expand(files[target]),
        dest = target;

    cmd.push(src.join(' '));

    // destination to copy
    cmd.push(user + '@' + host + ':' + remoteBase + '/' + target); // TODO: normalize
    cmd = cmd.join(' ');

    grunt.log.writeln( 'executing: ' + cmd );
    grunt.log.write( 'starting transfer... ' );

    exec(cmd, rsyncCallback);
    grunt.log.ok();
  }

  grunt.util = grunt.util || grunt.utils;

  grunt.registerMultiTask('rsync', 'Copy files to a (remote) machine with rsync.', function () {

    var done = this.async(),
        files = createFileMap(this.data.files),
        
        
        // options
        dry = grunt.option('no-write'),
        host = this.data.options.host || 'localhost',
        user = this.data.options.user || 'getGitUser',
        
        
        // TODO system username or nothing?
        remoteBase = this.data.options.remoteBase || '~',
        verbose = grunt.option('verbose'),
        preserveTimes = this.data.options.preserveTimes || false,
        preservePermissions = this.data.options.preservePermissions || true,
        compression = this.data.options.compression || true,
        recursive = this.data.options.recursive || true,
        additionalOptions = this.data.options.additionalOptions || '';

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
    // save command before execute files-map wise
    for (var target in files) {
      // copy command
      doRsync(command.slice(), user, host, remoteBase, target, files);
    } // for in files
    done(true);

  });

  function createFileMap(files) {
    var map = {};

    files = files instanceof Object ? files : {
      '': files
    };

    for (var target in files) {

      map[target] = files[target];
    }
    return map;
  }
};
