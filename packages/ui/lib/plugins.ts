/**
 * @fileoverview Plugin loader
 */

//Imports
import loadPlugins from '~/plugin-loader/index';
import {ConfigEnv, UserConfig} from 'vite';
import {UiContext, UiResult} from '~/plugin-sdk/types';
import {copy, emptyDir, ensureDir} from 'fs-extra';
import {dirname, join} from 'path';
import {fileURLToPath} from 'url';
import {readPackage} from 'read-pkg';

//Files to copy
const COPY_PATHS = [
  'index.html',
  'public',
  'src'
];

//Get extra plugin packages
const extras = JSON.parse(process.env.EXTRA_PLUGINS ?? '[]');

/**
 * Load plugins
 * @param config Vite config
 * @param env Vite config environment
 * @returns Modified Vite config
 */
export const load = async (config: UserConfig, env: ConfigEnv) =>
{
  //Compute the root directory
  const root = dirname(fileURLToPath(import.meta.url));

  //Compute the merged directory
  const merged = join(root, '.merged');

  //Prepare the merged directory
  await ensureDir(merged);
  await emptyDir(merged);

  //Copy the original source code
  for (const path of COPY_PATHS)
  {
    await copy(path, join(merged, path));
  }

  //Read the package
  const pkg = await readPackage({
    cwd: root
  });

  if (pkg == null)
  {
    throw new Error(`Failed to read package.json for directory ${root}!`);
  }

  //Load plugins
  const results = await loadPlugins<UiContext, UiResult>(root, pkg.version, extras, 'ui', {
    config,
    env
  }, {
    info: console.info,
    warn: console.warn,
    error: console.error
  });

  //Merge plugin source code
  for (const result of results)
  {
    if (result.merge != null)
    {
      //Copy the plugin source code
      for (const [src, dest] of Object.entries(result.merge))
      {
        await copy(src, join(merged, dest), {
          overwrite: true
        });
      }
    }
  }

  return config;
};
