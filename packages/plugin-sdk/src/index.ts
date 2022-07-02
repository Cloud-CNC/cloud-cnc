/**
 * @fileoverview Plugin SDK
 */

//Imports
import {ApiServerContext, PluginConfig} from './types';
import {diff} from 'semver';
import {version as sdkVersion} from '../package.json';

/**
 * Define an API-server plugin
 * @param config Plugin config
 * @returns Plugin (Should be exported via `export default` or `module.exports`)
 */
export const defineApiServerPlugin = (config: Partial<PluginConfig<ApiServerContext>>) => async (hostVersion: string, ctx: ApiServerContext) =>
{
  //Check the SDK version is compatible with the host version
  if (diff(hostVersion, sdkVersion) != 'major')
  {
    throw new Error('Unsupported plugin SDK version! (Please contact the plugin author)');
  }

  //Invoke the load handler
  await config.onLoad?.(ctx);
};