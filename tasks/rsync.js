/*
 * grunt-rsync
 * https://github.com/maxdaten/grunt-rsync
 *
 * Copyright (c) 2012 Jan-Philip Loos
 * Licensed under the MIT license.
 */

module.exports = function (grunt) {
  'use strict';
  var _this = this;


  function doRsync(cmd, args, options, target, files, doneCallback) {
    var src = grunt.file.expand(files[target]),
        dest = target;

    if(src.length === 0){
      grunt.fail.warn('There are no files to transfer.');
    }
    args.push(src.join(' '));

    // destination to copy
    args.push((options.user === '' ? '' :  options.user + '@') + options.host + ':' + options.remoteBase + '/' + target); // TODO: normalize
    if(options.deleteAfter && !options.dry){
      args.push('&& rm -rf ' + src.join(' '));
    }
    // cmd.push();
    // cmd = cmd.join(' ');

    grunt.log.writeln( 'Executx ing: ' + cmd );
    grunt.log.writeln( 'args: ' +  args);
    grunt.log.writeln( 'Starting transfer... ' );

    if (!options.dry) {
      var success = false;
      var child = grunt.util.spawn(
        { cmd  : 'rsync'
        , args : args
        , opts : { stdio: 'inherit' }
        },

        function (error, res, code) {
          grunt.verbose.writeln(res.stdout);
          
          if (error) {
            grunt.verbose.writeln(res.stderr);
            grunt.fatal(error); // TODO not exit
          } else {
            grunt.log.ok('Files transfer was successful.');
            success = true;
          }
          doneCallback(success);
        }
      );

    }
    // return success || options.dry;
  }

  grunt.registerMultiTask('rsync', 'Copy files to a (remote) machine with rsync.', function () {

    var done = this.async(),
        files = _this.createFileMap(this.data.files);
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
        options.clean = options.clean || false,
        options.deleteAfter = options.deleteAfter || false;

    // setup the cmd
    var command = 'rsync';
    var args = [];

    // these flags must be set before the src/dest args
    if (options.recursive) {
      args.push('-r');
    }

    if (options.verbose) {
      args.push('-v');
    }

    if (options.preserveTimes) {
      args.push('-t');
    }

    if (options.preservePermissions) {
      args.push('-p');
    }

    if(options.clean){
      args.push('--delete');
      args.push('--delete-after');
    }

    if (options.compression) {
      args.push('-z');
    }

    if (options.dry) {
      args.push('--dry-run');
    }

    if (options.additionalOptions) {
      args.push(options.additionalOptions);
    }

    // from this line on, the order of the args is relevant!
    // files to copy
    // save command before execute files-map wise
    var allSuccessful = true;
    var runningChilds = files.length;
    var doneCallback = function (success) {
      runningChilds -= 1;
      if (runningChilds === 0) {
        allSuccessful = allSuccessful && success;
        done(allSuccessful);
      }
      return success;
    };

    for (var target in files) {
      doRsync(command, args.slice(), options, target, files, doneCallback); // .slice() => copy array
    }
  });

  this.createFileMap = function(files) {
    var map = {};

    files = files instanceof Object ? files : {
      '': files
    };

    for (var target in files) {

      map[target] = files[target];
    }
    return map;
  };
};
