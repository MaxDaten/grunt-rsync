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

  function ExitHandler(num, done) {
    this.numOfProcesses = num;
    this.done = done;
    this.exitCallback = function(processName) {
      this.numOfProcesses--;
        
      if (this.numOfProcesses === 0) {
        grunt.log.writeln('all processes done');
        done(true);
      } else {
        grunt.log.writeln('process done: ' + processName);
      }
    };
    this.abort = function(processName){
      grunt.log.writeln('abort by: ' + processName);
      done(false);
    };
  }

// stolen from: http://stackoverflow.com/a/336868/605745
  function truncate (fullStr, strLen, separator) {
    if (fullStr.length <= strLen) {return fullStr;}

    separator = separator || '...';

    var sepLen = separator.length,
        charsToShow = strLen - sepLen,
        frontChars = Math.ceil(charsToShow/2),
        backChars = Math.floor(charsToShow/2);

    return fullStr.substr(0, frontChars) +
           separator +
           fullStr.substr(fullStr.length - backChars);
  }


  function doRsync(cmd, user, host, remoteBase, target, files, exitHandler) {
    var spawn = require('child_process').spawn,
        src = grunt.file.expand(files[target]),
        dest = target;

    // flatten the src list
    cmd.push.apply(cmd, src);

    // destination to copy
    cmd.push(user + '@' + host + ':' + remoteBase + '/' + target); // TODO: normalize

    var cmdLine = 'rsync ' + cmd.join(' ');
    grunt.log.writeln( 'executing: >' + cmdLine + '<' );
    grunt.log.write( 'starting transfer... ' );

    var rsync = spawn('rsync', cmd);

    rsync.stdout.on('data', function (data) {
      grunt.log.writeln('out: ' + data);
    });

    rsync.stderr.on('data', function (data) {
      grunt.log.writeln('err: ' + data);
    });

    rsync.on('exit', function (code) {
      var procName = rsync.pid + ':: ' + truncate(cmdLine, 100);
      if (code === 0) {
        grunt.log.ok();
        exitHandler.exitCallback(procName);
      } else {
        grunt.fail.fatal('err: ' + code);
        exitHandler.abort(procName);
      }
    });
  }

  grunt.util = grunt.util || grunt.utils;

  grunt.registerMultiTask('rsync', 'Copy files to a (remote) machine with rsync.', function () {
    var done = this.async(),
        files = grunt.helper('createFileMap', this.data.files),
        
        
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
        additionalOptions = this.data.options.additionalOptions || undefined;

    // setup the cmd
    var command = [];

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

    if (additionalOptions !== undefined) {
      command.push(additionalOptions);
    }

    // create process exit handler
    var exitHandler = new ExitHandler(files.length);

    // from this line on, the order of the args is relevant!
    // files to copy
    // save command before execute files-map wise
    for (var target in files) {
      // slice to copy array
      doRsync(command.slice(), user, host, remoteBase, target, files, exitHandler);
    } // for in files

  });

  grunt.registerHelper('createFileMap', function (files) {
    var map = {};
    
    files = files instanceof Object &&
          !(files instanceof Array) ? files : {
      '': files
    };

    for (var target in files) {

      map[target] = files[target];
    }
    return map;
  });
};