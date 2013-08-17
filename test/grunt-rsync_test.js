var grunt = require('grunt'),
    rsync = new (require('../tasks/rsync'))(grunt);

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.rsync = {
  'one': function (test) {
    'use strict';

    test.expect(1);
    // tests here
    test.equal(1, 1);
    test.done();
  },
  'Helper#createFileMap with one flat file <string> (no map)': function (test) {
    'use strict';
    test.expect(1);

    var files = 'a/b/c';
    var fileMap = rsync.createFileMap(files);

    test.deepEqual(fileMap, {
      '': 'a/b/c'
    });
    test.done();
  },
  'Helper#createFileMap-identity with one element map <string:string>': function (test) {
    'use strict';
    test.expect(1);

    var files = {
      'cde/f': 'a/b/c'
    };
    var fileMap = rsync.createFileMap(files);

    test.deepEqual(fileMap, {
      'cde/f': 'a/b/c'
    });
    test.done();
  },
  'Helper#createFileMap-identity with one element map <string:[string]>': function (test) {
    'use strict';
    test.expect(1);

    var files = {
      'cde/f': ['a/b/c', 'e/**/*.txt']
    };
    var fileMap = rsync.createFileMap(files);

    test.deepEqual(fileMap, {
      'cde/f': ['a/b/c', 'e/**/*.txt']
    });
    test.done();
  },
  'Helper#createFileMap-identity with multiple element map <string:[string]> | <string:string>': function (test) {
    'use strict';
    test.expect(1);

    var files = {
      'cde/f': ['a/b/c', 'e/**/*.txt'],
      'ddd/': 'e/f',
      'rrr/': ['hh/*.txt']
    };
    var fileMap = rsync.createFileMap(files);

    test.deepEqual(fileMap, files);
    test.done();
  }
};