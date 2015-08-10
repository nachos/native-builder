'use strict';

var path = require('path');
var execQ = require('child-process-promise').exec;
var whichNativeNodish = require('which-native-nodish');

/**
 * Resolve the build command
 * @returns {Q.promise} The build command
 */
function resolve() {
  return whichNativeNodish('..')
    .then(function (results) {
      var nwVersion = results.nwVersion;
      var asVersion = results.asVersion;

      var prefix = '';
      var target = '';
      var debug = process.env.BUILD_DEBUG ? ' --debug' : '';
      var builder = 'pangyp';
      var distUrl = '';

      if (asVersion) {
        prefix = (process.platform === 'win32' ?
          'SET HOME=%HOME%\\.electron-gyp&&' :
          'HOME=~/.electron-gyp');

        target = '--target=' + asVersion;
        distUrl = '--dist-url=https://atom.io/download/atom-shell';
      }
      else if (nwVersion) {
        builder = 'nw-gyp';
        target = '--target=' + nwVersion;
      }

      builder = path.resolve('.', 'node_modules', '.bin', builder);
      builder = builder.replace(/\s/g, '\\$&');

      return [prefix, builder, 'rebuild', target, debug, distUrl]
        .join(' ').trim();
    });
}

/**
 * Build the packages with the given build command
 * @param cmd The build command
 * @returns {Q.promise} promise to finish building
 */
function build(cmd) {
  var opts = {
    maxBuffer: Number.MAX_VALUE,
    env: process.env
  };

  return execQ('npm install --ignore-scripts')
    .then(function () {
      return execQ(cmd, opts);
    });
}

module.exports = {
  resolve: resolve,
  build: build
};