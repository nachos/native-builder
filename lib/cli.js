'use strict';

var program = require('commander');
var pkg = require('../package.json');
var builder = require('./');
var Spinner = require('cli-spinner').Spinner;
var PrettyError = require('pretty-error');

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
        var pe = new PrettyError();
        var renderedError = pe.render(err);

        console.log(renderedError);
      });
  });

program
  .command('build')
  .description('Build native packages according to your engine')
  .action(function () {
    var spinner = new Spinner('building... %s');

    spinner.setSpinnerString('|/-\\');
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
        var pe = new PrettyError();
        var renderedError = pe.render(err);

        console.log(renderedError);
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