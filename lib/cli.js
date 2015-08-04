var program = require('commander');
var pkg = require('../package.json');

program
  .version(pkg.version)
  .description('A cli tool to build native packages according to your engine')
  .usage('[command]');

program
  .command('build')
  .description('Build native packages according to your engine')
  .action(function () {
    console.log('trying');
    require('./')();
  });

/**
 * Handle cli arguments
 * @param {string[]} argv - string array of the arguments
 */
module.exports = function (argv) {
  program.parse(argv);
};