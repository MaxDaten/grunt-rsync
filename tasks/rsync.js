/*jslint node: true*/
"use strict";

/*
 * grunt-rsync
 * https://github.com/maxdaten/grunt-rsync
 *
 * Copyright (c) 2012 Jan-Philip Loos
 * Licensed under the MIT license.
 */

module.exports = function (grunt) {

  grunt.util = grunt.util;
  var rsync = require('./utils');
  var ExitHandler = require('./ExitHandler');

  grunt.registerMultiTask('rsync', 'Copy files to a (remote) machine with rsync.', function (arg) {
    var done = this.async(),
        options = this.options({
          dry : grunt.option('no-write'),
          host : 'localhost',
          user : process.env.USER,

          base : '.',
          remoteBase : '~',
          verbose : grunt.option('verbose'),
          preserveTimes : false,
          preservePermissions : true,
          compression : true,
          recursive : true,
          additionalOptions : undefined
        });

    var command = [];

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

    if (options.additionalOptions !== undefined) {
      command.push(options.additionalOptions);
    }

    // create process exit handler
    var exitHandler = new ExitHandler(grunt, Object.keys(this.files).length, done);

    this.files.forEach(function(file) {
      rsync.doRsync(grunt, command.slice(), options, file, exitHandler);
    });
  });

};