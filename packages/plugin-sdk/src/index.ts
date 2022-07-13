/**
 * @fileoverview Plugin SDK
 */

//Imports
import semver from 'semver';
import {ApiServerContext, ApiServerConfig, ApiServerResult, UiContext, UiConfig, UiResult} from './types';
import {dirname} from 'path';
import {fileURLToPath} from 'url';
import {version as sdkVersion} from '../package.json';

/**
 * Define an API-server plugin
 * @param config Plugin config
 * @returns Plugin (Should be exported via `export default` or `module.exports`)
 */
export const defineApiServerPlugin = (config: Partial<ApiServerConfig>) => async (hostVersion: string, ctx: ApiServerContext): Promise<ApiServerResult> =>
{
  //Check the SDK version is compatible with the host version
  if (semver.diff(hostVersion, sdkVersion) != 'major')
  {
    throw new Error('Unsupported plugin SDK version! (Please contact the plugin author)');
  }

  //Invoke the load handler
  await config.onLoad?.(ctx);

  return {
    name: config.name
  };
};

/**
 * Define an UI plugin
 * @param config Plugin config
 * @returns Plugin (Should be exported via `export default` or `module.exports`)
 */
export const defineUiPlugin = (config: Partial<UiConfig>) => async (hostVersion: string, ctx: UiContext): Promise<UiResult> =>
{
  //Check the SDK version is compatible with the host version
  if (semver.diff(hostVersion, sdkVersion) != 'major')
  {
    throw new Error('Unsupported plugin SDK version! (Please contact the plugin author)');
  }

  //Invoke the load handler
  await config.onLoad?.(ctx);

  //Get the directory name
  const dir = __dirname ?? dirname(fileURLToPath(import.meta.url));

  return {
    name: config.name,
    dir,
    merge: config.merge
  };
};