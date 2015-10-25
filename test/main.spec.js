'use strict';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var mockery = require('mockery');
var Q = require('q');
var path = require('path');

chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));

describe('native-builder', function () {
  describe('Running with no engine', function () {
    it('should be ok', function () {
      var nativeBuilder = require('../lib');

      return expect(nativeBuilder.resolve()).to.be.fulfilled;
    });
  });

  describe('Running atom shell win32', function () {
    before(function () {
      var whichNativeStub = sinon.stub().returns(Q.resolve({ asVersion: '0.30.1' }));

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
      Object.defineProperty(process, 'platform', {
        value: this.originalPlatform
      });
    });

    it('should work', function () {
      var nativeBuilder = require('../lib');
      var builder = '"' + path.resolve(__dirname, '..', 'node_modules', '.bin', 'node-gyp') + '"';
      var electronSetup = 'SET USERPROFILE=%USERPROFILE%\\.electron-gyp&& ';
      var distUrl = '  --dist-url=https://atom.io/download/atom-shell';

      this.originalPlatform = process.platform;
      Object.defineProperty(process, 'platform', {
        value: 'win32'
      });

      return expect(nativeBuilder.resolve()).to.eventually.equal(electronSetup.concat(builder, ' rebuild --target=0.30.1', distUrl));
    });
  });

  describe('Running atom shell otherOS', function () {
    before(function () {
      var whichNativeStub = sinon.stub().returns(Q.resolve({ asVersion: '0.30.1' }));

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
      Object.defineProperty(process, 'platform', {
        value: this.originalPlatform
      });
    });

    it('should work', function () {
      var nativeBuilder = require('../lib');
      var builder = '"' + path.resolve(__dirname, '..', 'node_modules', '.bin', 'node-gyp') + '"';
      var electronSetup = 'HOME=~/.electron-gyp ';
      var distUrl = '  --dist-url=https://atom.io/download/atom-shell';

      // Can't happen before the creation of native builder, since it ruins the child-process require
      this.originalPlatform = process.platform;
      Object.defineProperty(process, 'platform', {
        value: 'JustSomeOS'
      });

      return expect(nativeBuilder.resolve()).to.eventually.equal(electronSetup.concat(builder, ' rebuild --target=0.30.1', distUrl));
    });
  });

  describe('Running node webkit', function () {
    before(function () {
      var whichNativeStub = sinon.stub().returns(Q.resolve({ nwVersion: '0.12.0' }));

      mockery.registerMock('which-native-nodish', whichNativeStub);
      mockery.enable({
        useCleanCache: true,
        warnOnReplace: false,
        warnOnUnregistered: false
      });
      this.env = Object.getOwnPropertyDescriptor(process, 'env');
      this.env.BUILD_DEBUG = true;
      Object.defineProperty(process, 'env', {
        value: this.env
      });
    });

    after(function () {
      mockery.deregisterMock('which-native-nodish');
      mockery.disable();

      this.env.BUILD_DEBUG = false;
      Object.defineProperty(process, 'env', {
        value: this.env
      });
    });

    it('should work in debug', function () {
      var nativeBuilder = require('../lib');
      var builder = '"' + path.resolve(__dirname, '..', 'node_modules', '.bin', 'nw-gyp') + '"';

      return expect(nativeBuilder.resolve()).to.eventually.equal(builder.concat(' rebuild --target=0.12.0  --debug'));
    });
  });

  describe('Trying to build', function () {
    var execStub;

    before(function () {
      var whichNativeStub = sinon.stub().returns(Q.resolve({ nwVersion: '0.12.0' }));

      execStub = sinon.stub();

      mockery.registerMock('child_process', {exec: execStub});
      mockery.registerMock('which-native-nodish', whichNativeStub);
      mockery.enable({
        useCleanCache: true,
        warnOnReplace: false,
        warnOnUnregistered: false
      });
    });

    after(function () {
      mockery.deregisterMock('which-native-nodish');
      mockery.deregisterMock('child_process');
      mockery.disable();
    });

    it('should call exec with resolved command', function () {
      var nativeBuilder = require('../lib');

      return nativeBuilder.build()
        .then(function () {
          return expect(execStub).to.have.been.calledWithMatch('nw-gyp" rebuild --target=0.12.0');
        });
    });
  });
});
