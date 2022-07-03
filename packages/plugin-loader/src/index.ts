/**
 * @fileoverview Plugin loader
 */

//Imports
import {PackageCloudCnc} from './types';
import {Plugin} from '~/plugin-sdk/types';
import {access} from 'fs/promises';
import {constants} from 'fs';
import {join} from 'path';
import {readPackage} from 'read-pkg';
import {satisfies} from 'semver';

/**
 * Logging callback
 */
type LogCallback = (message: string) => void;

/**
 * Logging callbacks
 */
interface LogCallbacks
{
  /**
   * Info-level logging callback
   */
  info: LogCallback;

  /**
   * Warning-level logging callback
   */
  warn: LogCallback;

  /**
   * Error-level logging callback
   */
  error: LogCallback;
}

/**
 * Load plugins
 * @param T Plugin context
 * @param U Plugin result
 * @param root Root directory
 * @param version Host Cloud CNC version
 * @param extras Extra plugin package names
 * @param suffix Plugin import suffix
 * @param ctx Plugin context
 * @param log Logging callbacks
 */
const loadPlugins = async <T, U>(root: string, version: string, extras: string[], suffix: string, ctx: T, log?: LogCallbacks): Promise<U[]> =>
{
  //Read the root package
  const rootPkg = await readPackage({
    cwd: root
  });

  if (rootPkg == null)
  {
    throw new Error(`Failed to read package.json for directory ${root}!`);
  }

  //Get plugins package names
  const pkgNames = extras;
  for (const dependencyName of Object.keys(rootPkg.dependencies ?? {}))
  {    
    //Parse the name
    const parsed = /^(?:@([^/]+)\/)?([^@]+)$/.exec(dependencyName);

    if (parsed == null)
    {
      log?.warn(`Failed to parse package name ${parsed}!`);
      continue;
    }

    //Extract data
    const scope = parsed[1];
    const name = parsed[2];

    //Filter by name
    if (
      !(scope == 'cloud-cnc' && name?.startsWith('plugin-') && name != 'plugin-sdk') &&
      !name?.startsWith('cloud-cnc-plugin-')
    )
    {
      continue;
    }

    //Generate the dependency directory
    const dependencyDir = join(root, 'node_modules', dependencyName);

    //Ensure the directory exists
    try
    {
      await access(dependencyDir, constants.R_OK);
    }
    catch (_)
    {
      continue;
    }

    //Read the dependency package
    const dependencyPkg = await readPackage({
      cwd: dependencyDir
    });

    if (dependencyPkg == null)
    {
      throw new Error(`Failed to read package.json for directory ${dependencyDir}!`);
    }

    //Cast the exports property
    const exports = dependencyPkg.exports as Record<string, unknown>;

    //Filter by keywords and exports
    if (
      !dependencyPkg.keywords?.includes('cloud-cnc-plugin') ||
      typeof exports != 'object' ||
      exports['./relay'] == null ||
      exports['./server'] == null ||
      exports['./ui'] == null
    )
    {
      continue;
    }

    //Cast the custom "cloud-cnc" property
    const cloudCnc = dependencyPkg['cloud-cnc'] as PackageCloudCnc;

    //Filter by the host Cloud CNC version
    if (
      typeof cloudCnc != 'object' ||
      !satisfies(version, cloudCnc.version)
    )
    {
      log?.warn(`Incompatible plugin ${dependencyName}! (${cloudCnc.version} is not satisfied by ${version})`);
      continue;
    }

    //Add the name
    pkgNames.push(dependencyName);

    //Recur on sub-dependencies
    await loadPlugins(dependencyDir, version, [], suffix, ctx, log);
  }

  //Load plugins
  const results = [];
  for (const pkgName of pkgNames)
  {
    //Compute the full import name
    const importName = `${pkgName}/${suffix}`;

    //Import the plugin
    const plugin = await import(importName) as Plugin<T, U>;

    //Load the plugin
    const result = await plugin(version, ctx);

    //Add the result
    results.push(result);

    //Log
    log?.info(`Loaded plugin ${pkgName}.`);
  }

  return results;
};

//Export
export default loadPlugins;