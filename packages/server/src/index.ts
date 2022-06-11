/**
 * App entrypoint
 */

//Imports
import {program} from 'commander';
import {version} from '../package.json';

//Commands
import '@/server/commands/bootstrap';
import '@/server/commands/run';

//Create the root command
const command = program
  .name('server')
  .description('Cloud CNC API server')
  .version(version);

//Process arguments and options
command.parse(process.argv);