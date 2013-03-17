/*jslint node: true*/
"use strict";

var ExitHandler = function(grunt, num, done) {
  this.numOfProcesses = num;
  this.done = done;
  this.exitCallback = function(processName) {
    this.numOfProcesses--;

    grunt.log.debug('rsymc proc done> ' + processName + '\n\tremaining:' + this.numOfProcesses);
    if (this.numOfProcesses === 0) {
      grunt.log.debug('all rsync procs done');
      this.done(true);
    }
  };
  this.abort = function(processName){
    grunt.log.fail('abort> ' + processName);
    this.done(false);
  };
};

module.exports = ExitHandler;
