'use strict';

var path = require('path');
var execQ = require('child-process-promise').exec;
var whichNativeNodish = require('which-native-nodish');

var nwVersion = null;
var asVersion = null;

function resolve() {
  
}

function build() {
  var opts = {
    maxBuffer: Number.MAX_VALUE,
    env: process.env
  };

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

  return execQ('npm install --ignore-scripts')
    .then(function () {
      builder = path.resolve('.', 'node_modules', '.bin', builder);
      builder = builder.replace(/\s/g, '\\$&');
      var cmd = [prefix, builder, 'rebuild', target, debug, distUrl]
        .join(' ').trim();

      return execQ(cmd, opts);
    });
}

module.exports = function () {
  return whichNativeNodish('..')
    .then(function (results) {
      nwVersion = results.nwVersion;
      asVersion = results.asVersion;
    })
    .then(function () {
      return build();
    });
};