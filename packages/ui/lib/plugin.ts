/**
 * @fileoverview Plugin loader
 */

//Imports
import loadPlugins from '../../plugin-loader/src/index';
import watch from 'node-watch';
import {ConfigEnv, UserConfig} from 'vite';
import {UiContext, UiResult} from '~/plugin-sdk/types';
import {CopyOptions, copy, emptyDir, ensureDir} from 'fs-extra';
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
 * Copy from src to dest, repeating each time src is changed
 * 
 * *Note: this function will overwrite destination!*
 * @param src Source path
 * @param dest Destination path
 * @param options Additional copy options
 */
const copyWatch = async (src: string, dest: string, options?: CopyOptions) =>
{
  //Forcible enable overwrite
  options = {
    ...options,
    overwrite: true
  };

  //Copy once
  await copy(src, dest, options);

  //Watch
  const watcher = watch(src, {
    recursive: true
  });

  //Re-copy as needed
  watcher.on('change', async () => await copy(src, dest, options));
};

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
    await copyWatch(path, join(merged, path));
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
        await copyWatch(src, join(merged, dest));
      }
    }
  }

  return config;
};
