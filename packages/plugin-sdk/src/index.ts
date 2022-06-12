/**
 * @fileoverview Plugin SDK
 */

//Imports
import {PluginLoadHandler, PluginSdkContext, PluginVersionChecker} from './types';
import {parse} from 'semver';
import {version as rawSdkVersion} from '../package.json';

/**
 * Plugin SDK
 */
class PluginSDK
{
  /**
   * Plugin version checker
   */
  public versionChecker?: PluginVersionChecker;

  /**
   * Plugin load handler
   */
  public loadHandler?: PluginLoadHandler;

  /**
   * Internal entry point
   * 
   * **NOTE: if you're a plugin developer, DO NOT USE THIS METHOD!**
   * @internal
   * @param rawHostVersion Host Cloud CNC version
   * @param ctx Internal plugin SDK context
   */
  public async _internalEntryPoint(rawHostVersion: string, ctx: PluginSdkContext)
  {
    //Parse the versions
    const hostVersion = parse(rawHostVersion);
    const sdkVersion = parse(rawSdkVersion);

    //Check the SDK version is compatible with the host version
    if (hostVersion == null || sdkVersion == null || hostVersion.major != sdkVersion.major)
    {
      throw new Error('Unsupported plugin SDK version! (Please contact the plugin author)');
    }

    //Check the plugin version is compatible with the host version
    if (this.versionChecker != null && !(await this.versionChecker(hostVersion)))
    {
      throw new Error('Unsupported plugin version! (Please contact the plugin author)');
    }

    //Invoke the load handler
    if (this.loadHandler != null)
    {
      await this.loadHandler(ctx);
    }
  }
}

//Export
export default PluginSDK;