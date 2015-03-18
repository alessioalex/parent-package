# parent-package

Recursive search (folder path upwards) until the (/some) package.json data is found.

## Say what?

If the file path is `/blablabla/node_modules/NAME/blabla/bla.js` then it will get the JSON data from `/blablabla/node_modules/NAME/package.json`.
If the file path is `/www/project/sample.js` and `/www/project/package.json` exists it will get the data from there.
Else it will look for it inside `/www/package.json`, etc. until it finds it (or not).

## Usage

```js
var assert = require('assert');
var inspect = require('util').inspect;
var getParentPkgJson = require('../');
var FILE_PATH = process.env.FILE_PATH || __filename;

getParentPkgJson(FILE_PATH, function(err, data, pkgJsonPath) {
  if (err) { throw err; }

  assert.deepEqual(require(__dirname + '/../package.json'), data);

  console.log('The closest package.json data found for the file \n<%s> is:\n\n%s',
    FILE_PATH, inspect(data, null, 4));

  console.log('\npackage.json path: %s', pkgJsonPath);
});
```

Sample output:


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

    package.json path: c:\Users\alessioalex\Desktop\node_stuff\parent-package\package.json

## LICENSE

MIT
