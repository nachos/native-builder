'use strict';

var program = require('commander');
var pkg = require('../package.json');
var builder = require('./');
var Spinner = require('cli-spinner').Spinner;

program
  .version(pkg.version)
  .description('A cli tool to build native packages according to your engine')
  .usage('[command]');

program
  .command('resolve')
  .description('Resolve the build command')
  .action(function () {
    builder.resolve()
      .then(function (cmd) {
        console.log(cmd);
      });
  });

program
  .command('build')
  .description('Build native packages according to your engine')
  .action(function () {
    var spinner = new Spinner('building... %s');

    spinner.setSpinnerString('|/-\\');

    console.log('resolving correct build command');
    builder.resolve()
      .then(function (cmd) {
        console.log('resolved this command:\n%s', cmd);
        spinner.start();

        return builder.build(cmd);
      })
      .then(function () {
        spinner.stop(true);
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