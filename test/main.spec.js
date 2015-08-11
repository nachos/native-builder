'use strict';

var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var chaiAsPromised = require('chai-as-promised');
var sinon = require('sinon');
var mockery = require('mockery');
var Q = require('q');
var path = require('path');

chai.use(chaiAsPromised);

describe('native-builder', function () {
  describe('Running with no engine', function () {
    it('should be ok', function () {
      var nativeBuilder = require('../lib');

      return expect(nativeBuilder.resolve()).to.be.fulfilled;
    });
  });

  describe('Running atom shell', function () {
    before(function () {
      var deferred = Q.defer();
      var whichNativeStub = sinon.stub().returns(deferred.promise);

      deferred.resolve({ asVersion: '0.30.1' });
      mockery.registerMock('which-native-nodish', whichNativeStub);
      mockery.enable({
        useCleanCache: true,
        warnOnReplace: false,
        warnOnUnregistered: false
      });
    });

    after(function () {
      mockery.deregisterMock('which-native-nodish');
      mockery.disable();
    });

    it('should work', function () {
      var nativeBuilder = require('../lib');
      var builder = path.resolve(__dirname, '..', 'node_modules', '.bin', 'pangyp');
      var electronSetup = 'SET USERPROFILE=%USERPROFILE%\\.electron-gyp&& ';
      var distUrl = '  --dist-url=https://atom.io/download/atom-shell';

      return assert.eventually.equal(nativeBuilder.resolve(), electronSetup.concat(builder, ' rebuild --target=0.30.1', distUrl));
    });
  });

  describe('Running node webkit', function () {
    before(function () {
      var deferred = Q.defer();
      var whichNativeStub = sinon.stub().returns(deferred.promise);

      deferred.resolve({ nwVersion: '0.12.0' });
      mockery.registerMock('which-native-nodish', whichNativeStub);
      mockery.enable({
        useCleanCache: true,
        warnOnReplace: false,
        warnOnUnregistered: false
      });
    });

    after(function () {
      mockery.deregisterMock('which-native-nodish');
      mockery.disable();
    });

    it('should work', function () {
      var nativeBuilder = require('../lib');
      var builder = path.resolve(__dirname, '..', 'node_modules', '.bin', 'nw-gyp');

      return assert.eventually.equal(nativeBuilder.resolve(), builder.concat(' rebuild --target=0.12.0'));
    });
  });

  describe('Trying to build', function () {
    it('should throw when no arguments received', function () {
      var nativeBuilder = require('../lib');

      return expect(nativeBuilder.build()).to.be.rejected;
    });
  });
});
