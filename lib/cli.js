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
  .option('-v, --verbose', 'Detailed output for the build process')
  .action(function (options) {
    var spinner = new Spinner('building... %s');

    if (!options.verbose) {
      spinner.start();
    }

    builder.build()
      .then(function (exec) {
        var output = '';

        exec.stdout.on('data', function (data) {
          output += data;
        });

        if (options.verbose) {
          exec.stdout.pipe(process.stdout);
        }

        exec.on('error', function (err) {
          spinner.stop(true);
          console.log(pe.render(err));
        });

        exec.on('exit', function (code) {
          spinner.stop(true);

          if (code === 0) {
            console.log('finished successfully');

            return;
          }

          console.log('exited with error code: %s', code);

          if (!options.verbose) {
            console.log(output);
          }
        });
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