/*jslint node: true*/
"use strict";


// stolen from: http://stackoverflow.com/a/336868/605745
var truncate = function (fullStr, strLen, separator) {
  if (fullStr.length <= strLen) {return fullStr;}

  separator = separator || '...';

  var sepLen = separator.length,
      charsToShow = strLen - sepLen,
      frontChars = Math.ceil(charsToShow/2),
      backChars = Math.floor(charsToShow/2);

  return fullStr.substr(0, frontChars) +
         separator +
         fullStr.substr(fullStr.length - backChars);
};


var doRsync = function(grunt, cmd, options, fileSet, exitHandler) {
  var spawn = require('child_process').spawn;

  if (fileSet.src.size === 0) {
    grunt.fatal('no files selected: ' + fileSet.dest + ' : ' + fileSet.src);
  }
  // flatten the src list
  cmd.push.apply(cmd, fileSet.src);

  // destination to copy
  cmd.push(options.user + '@' + options.host + ':' + options.remoteBase + '/' + (fileSet.dest || '')); // TODO: normalize

  var cmdLine = 'rsync ' + cmd.join(' ');
  grunt.log.writeln( 'executing:>$ ' + cmdLine + '<' );
  grunt.log.write( 'starting transfer... ' );

  var rsync = spawn('rsync', cmd);

  rsync.stdout.on('data', function (data) {
    grunt.log.writeln(data);
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
};

module.exports.truncate = truncate;
module.exports.doRsync = doRsync;

