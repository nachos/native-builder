'use strict';

var program = require('commander');
var pkg = require('../package.json');
var builder = require('./');
var Spinner = require('cli-spinner').Spinner;
var PrettyError = require('pretty-error');
var pe = new PrettyError();

Spinner.setDefaultSpinnerString(process.platform === 'win32' ? 0 : 8);

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
      })
      .catch(function (err) {
        console.log(pe.render(err));
      });
  });

program
  .command('build')
  .description('Build native packages according to your engine')
  .action(function () {
    var spinner = new Spinner('building... %s');

    spinner.start();

    builder.resolve()
      .then(function (cmd) {
        return builder.build(cmd);
      })
      .then(function () {
        spinner.stop(true);
        console.log('finished successfully');
      })
      .catch(function (err) {
        spinner.stop(true);
        console.log(pe.render(err));
      });
  });

/**
 * Handle cli arguments
 *
 * @param {String[]} argv - string array of the arguments
 */
module.exports = function (argv) {
  program.parse(argv);
};