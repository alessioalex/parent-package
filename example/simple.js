"use strict";

var assert = require('assert');
var inspect = require('util').inspect;
var getParentPkgJson = require('../');
var FILE_PATH = process.env.FILE_PATH || __filename;

getParentPkgJson(FILE_PATH, function(err, data) {
  if (err) { throw err; }

  assert.deepEqual(require(__dirname + '/../package.json'), data);

  console.log('The closest package.json data found for the file \n<%s> is:\n\n%s',
    FILE_PATH, inspect(data, null, 4));

  // Output:
  /*
  The closest package.json data found for the file
  <c:\Users\alessioalex\Desktop\node_stuff\parent-package\example\simple.js> is:

  { name: 'parent-package',
    version: '0.0.1',
    description: 'Recurse upwards until the package.json details are found',
    main: 'index.js',
    directories: { example: 'example' },
    scripts: { test: 'echo "Error: no test specified" && exit 1' },
    author: 'Alexandru Vladutu',
    license: 'MIT',
    dependencies: { 'try-json-parse': '~0.1.1', debug: '~2.1.3' } }
  */
});
