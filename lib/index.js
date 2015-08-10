'use strict';

var path = require('path');
var execQ = require('child-process-promise').exec;
var whichNativeNodish = require('which-native-nodish');
var debug = require('debug')('nativeBuilder');

/**
 * Resolve the build command
 * @returns {Q.promise} The build command
 */
function resolve() {
  return whichNativeNodish('..')
    .then(function (results) {
      var nwVersion = results.nwVersion;
      var asVersion = results.asVersion;

      debug('which-native-nodish output: %j', results);

      var prefix = '';
      var target = '';
      var debugArg = process.env.BUILD_DEBUG ? ' --debug' : '';
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

      return [prefix, builder, 'rebuild', target, debugArg, distUrl]
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