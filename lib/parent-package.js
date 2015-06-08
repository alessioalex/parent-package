"use strict";

var JSONparse = require('try-json-parse');
var path = require('path');
var fs = require('fs');
var debug = require('debug')('closest-package');

// cross OS compatibility
var SEP = path.sep;
var parentPkgRegExp = (SEP === '\\') ? (/(.*)\\node_modules\\([A-Za-z0-9-]+)\\/)
                                     : (/(.*)\/node_modules\/([A-Za-z0-9-]+)\//);

var utils = {};

// recurse each time up a folder to see if there's a `package.json`
// Example: say you have a path like `c:\www\node_apps\my_app`
// first it will look at `c:\www\node_apps\my_app\package.json`
// then if that doesn't exist it will go to `c:\www\node_apps\package.json`
// and so on..
utils.searchRecursively = function searchRecursively(root, cb) {
  if (!root) {
    return cb(new Error('Could not find a package.json file'));
  }

  var pkgLocation = path.join(root, 'package.json');
  var newRoot = path.dirname(root);

  if (root === newRoot) {
    return cb(new Error('Could not find a package.json file'));
  } else {
    debug('checking %s', pkgLocation);

    fs.readFile(pkgLocation, 'utf8', function(err, content) {
      if (err && /ENOENT/.test(err.message)) {
        debug('%s does not exist', pkgLocation);

        return utils.searchRecursively(newRoot, cb);
      } else if (err) {
        return cb(err);
      } else {
        debug('%s exists', pkgLocation);

        var pkgData = JSONparse(content);
        var potentialErr = (pkgData) ? null
                                     : (new Error('Invalid package.json for ' + pkgLocation));

        return cb(potentialErr, pkgData, pkgLocation);
      }
    });
  }
};

utils.findParentPkgData = function findParentPkgData(file, cb) {
  var moduleLocation = file.match(parentPkgRegExp);
  var pkgLocation = '';

  // if the file has a path like `.../node_modules/MODULE_NAME/...bla`
  // that means that the parent package is `MODULE_NAME`
  var root = (moduleLocation && moduleLocation.length) ? moduleLocation[0]
                                                       : path.dirname(file);

  return utils.searchRecursively(root, cb);
};

module.exports = utils;
