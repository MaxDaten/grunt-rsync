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
    grunt.verbose.write(stdout);
    if (error) {
      grunt.verbose.write(stderr)
      grunt.fail.fatal(error);
    }else{
      grunt.log.ok('Files transferred successfully.');
    }
  }


  function doRsync(cmd, options, target, files) {
    var exec = require('child_process').exec,
        src = grunt.file.expand(files[target]),
        dest = target;

    if(src.length === 0){
      grunt.fail.warn('There are no files to transfer.');
    }
    cmd.push(src.join(' '));

    // destination to copy
    cmd.push((options.user === '' ? '' :  options.user + '@') + options.host + ':' + options.remoteBase + '/' + target); // TODO: normalize
    cmd = cmd.join(' ');

    grunt.log.writeln( 'Executing: ' + cmd );
    grunt.log.writeln( 'Starting transfer... ' );

    exec(cmd, rsyncCallback);
  }

  grunt.util = grunt.util || grunt.utils;

  grunt.registerMultiTask('rsync', 'Copy files to a (remote) machine with rsync.', function () {

    var done = this.async(),
        files = createFileMap(this.data.files);
        var options = this.data.options;
        // options
        options.dry = grunt.option('no-write'),
        options.host = options.host || 'localhost',
        options.user = options.user || '',

        // TODO system username or nothing?
        options.remoteBase = options.remoteBase || '~',
        options.verbose = grunt.option('verbose'),
        options.preserveTimes = options.preserveTimes || false,
        options.preservePermissions = options.preservePermissions || true,
        options.compression = options.compression || true,
        options.recursive = options.recursive || true,
        options.additionalOptions = options.additionalOptions || '';

    // setup the cmd
    var command = ['rsync'];

    // these flags must be set before the src/dest args
    if (options.recursive) {
      command.push('-r');
    }

    if (options.verbose) {
      command.push('-v');
    }

    if (options.preserveTimes) {
      command.push('-t');
    }

    if (options.preservePermissions) {
      command.push('-p');
    }

    if (options.compression) {
      command.push('-z');
    }

    if (options.dry) {
      command.push('--dry-run');
    }

    command.push(options.additionalOptions);

    // from this line on, the order of the args is relevant!
    // files to copy
    // save command before execute files-map wise
    for (var target in files) {
      // copy command
      doRsync(command.slice(), options, target, files);
    } // for in files

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
