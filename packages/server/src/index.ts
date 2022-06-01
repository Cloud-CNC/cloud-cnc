/**
 * App entrypoint
 */

//Imports
import {Project} from '@lerna/project';
import {program} from 'commander';
import {resolve} from 'path';

//Commands
import '@/commands/bootstrap';
import '@/commands/run';

/**
 * Get the project version
 */
export const getVersion = () =>
{
  //Resolve the project
  const project = new Project(resolve(__dirname, '..', '..'));

  return project.version;
};

//Create the root command
const command = program
  .name('server')
  .description('Cloud CNC API server')
  .version(getVersion());

//Process arguments and options
command.parse(process.argv);