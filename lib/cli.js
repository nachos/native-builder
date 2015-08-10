'use strict';

var program = require('commander');
var pkg = require('../package.json');
var builder = require('./');

program
  .version(pkg.version)
  .description('A cli tool to build native packages according to your engine')
  .usage('[command]');

program
  .command('resolve')
  .description('Build native packages according to your engine')
  .action(function () {
    console.log('resolving correct build command');
    builder.resolve()
      .then(function (cmd) {
        console.log('resolved this command:\n%s', cmd);
      });
  });

program
  .command('build')
  .description('Build native packages according to your engine')
  .action(function () {
    console.log('resolving correct build command');
    builder.resolve()
      .then(function (cmd) {
        console.log('resolved this command:\n%s', cmd);

        return builder.build(cmd);
      })
      .then(function () {
        console.log('finished successfully');
      });
  });

/**
 * Handle cli arguments
 * @param {string[]} argv - string array of the arguments
 */
module.exports = function (argv) {
  program.parse(argv);
};