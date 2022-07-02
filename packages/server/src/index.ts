/**
 * App entrypoint
 */

//Imports
import {program} from 'commander';
import {readPackageUpSync} from 'read-pkg-up';

//Commands
import '~/server/commands/bootstrap';
import '~/server/commands/run';

//Read the package
const pkg = readPackageUpSync();

if (pkg == null)
{
  throw new Error('Failed to read nearest package.json!');
}

//Create the root command
const command = program
  .name('server')
  .version(pkg.packageJson.version)
  .description('Cloud CNC API server');

//Process arguments and options
command.parse(process.argv);