/**
 * @fileoverview Plugin loader
 */

//Imports
import loadPlugins from '../../plugin-loader/src/index';
import {ConfigEnv, UserConfig} from 'vite';
import {UiContext, UiResult} from '~/plugin-sdk/types';
import {copy, emptyDir, ensureDir} from 'fs-extra';
import {join} from 'path';

//Files to copy
const COPY_PATHS = [
  'index.html',
  'public',
  'src'
];

//Get extra plugin packages
const extras = process.env.EXTRA_PLUGINS != null ? JSON.parse(process.env.EXTRA_PLUGINS) : [];

/**
 * Load plugins
 * @param root Root directory
 * @param config Vite config
 * @param env Vite config environment
 * @returns Modified Vite config
 */
export const load = async (root: string, config: UserConfig, env: ConfigEnv) =>
{
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

  //Load plugins
  const results = await loadPlugins<UiContext, UiResult>(root, extras, 'ui', {
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
