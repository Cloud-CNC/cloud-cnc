/**
 * @fileoverview Vite licenses plugin
 */

//Imports
import {Options} from './types';
import {Plugin} from 'vite';
import {exec} from 'child_process';
import {readPackageUp} from 'read-pkg-up';

/**
 * Run a command
 * @param command Command to run
 * @returns Standard output
 */
const run = (command: string) => new Promise<string>((resolve, reject) => exec(command, (error, stdout, stderr) =>
{
  //Trim outputs
  const out = stdout.trim();
  const err = stderr.trim();

  if (error)
  {
    reject(error);
  }
  else if (err.length > 0)
  {
    reject(new Error(`Failed to run command: ${err}!`));
  }
  else
  {
    resolve(out);
  }
}));

/**
 * Vite licenses plugin factory
 * @param rawOptions Plugin options
 * @returns Plugin instance
 */
const plugin = (options: Partial<Options> = {
  truncateHash: true
}) => ({
  name: 'meta',
  config: async () =>
  {
    //Read the package
    const pkg = await readPackageUp();

    if (pkg == null)
    {
      throw new Error('Failed to read nearest package.json!');
    }

    //Get Git information
    const branch = await run('git rev-parse --abbrev-ref HEAD');
    const commit = await run(options.truncateHash ? 'git rev-parse --short HEAD' : 'git rev-parse HEAD');
    const remote = await run('git remote get-url origin');

    return {
      define: {
        'import.meta.env.GIT_BRANCH': JSON.stringify(branch),
        'import.meta.env.GIT_COMMIT': JSON.stringify(commit),
        'import.meta.env.GIT_REMOTE': JSON.stringify(remote),
        'import.meta.env.VERSION': JSON.stringify(pkg.packageJson.version)
      }
    };
  },
} as Plugin);

//Export
export default plugin;