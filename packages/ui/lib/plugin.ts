/**
 * @fileoverview Plugin loader
 */

//Imports
import loadPlugins from '../../plugin-loader/src';
import {ConfigEnv, UserConfig} from 'vite';
import {UiContext, UiResult} from '~/plugin-sdk/types';
import {emptyDir, ensureDir} from 'fs-extra';
import {join} from 'path';
import {synchronize} from './utils';

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
const load = async (root: string, config: UserConfig, env: ConfigEnv) =>
{
  //Get if to watch when synchronizing
  const watch = env.mode == 'development';

  //Compute the merged directory
  const merged = join(root, '.merged');

  //Prepare the merged directory
  await ensureDir(merged);
  await emptyDir(merged);

  //Update the original source code
  for (const path of COPY_PATHS)
  {
    await synchronize(path, join(merged, path), watch);
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

  //Merge plugin source code and portal entries
  const portals = {} as Record<string, string>;
  for (const result of results)
  {
    //Merge source code
    if (result.merge != null)
    {
      //Update the plugin source code
      for (const [src, dest] of Object.entries(result.merge))
      {
        await synchronize(src, join(merged, dest), watch);
      }
    }

    //Merge portal entries
    if (result.portals != null)
    {
      for (const [key, value] of Object.entries(result.portals))
      {
        //Check for conflicts
        if (portals[key] != null)
        {
          throw new Error(`Portal key conflict ${key}! (This could indicate a plugin is tampering with another plugin)`);
        }

        portals[key] = value;
      }
    }
  }

  //Store portal entries
  config.portals = portals;

  return config;
};

//Export
export default load;