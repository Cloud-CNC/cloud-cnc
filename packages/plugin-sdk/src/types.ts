/**
 * @fileoverview TypeScript types
 */

//Imports
import {ConfigEnv, UserConfig} from 'vite';
import * as apiServerConfig from '~/server/lib/config';
import Koa from 'koa';
import {Hookable} from 'hookable';
import {Hooks as ApiHooks} from '~/server/lib/hooks';
import {Logger} from 'pino';

/**
 * Common plugin configuration
 * @param T Plugin loaded handler context
 */
interface CommonConfig<T>
{
  /**
   * Plugin name
   * @default Package name
   */
  name?: string;

  /**
   * Plugin loaded handler
   * @param ctx Plugin context
   */
  onLoad?: (ctx: T) => void | Promise<void>;
}

/**
 * Common plugin result
 */
interface CommonResult
{
  /**
   * Plugin name
   */
  name?: string;
}

/**
 * Plugin callback
 * 
 * *Note: if you're a plugin developer, you probably shouldn't use this!*
 * @param T Plugin context
 * @param U Plugin result
 * @param hostVersion Host Cloud CNC version
 * @param ctx Plugin context
 */
export type Plugin<T, U> = (hostVersion: string, ctx: T) => Promise<U>;

/**
 * API server plugin context
 */
export interface ApiServerContext
{
  /**
   * Koa app
   */
  app: Koa

  /**
   * Base app config
   */
  config: typeof apiServerConfig;

  /**
   * Hooks
   */
  hooks: Hookable<ApiHooks>;

  /**
   * Pino logger
   */
  log: Logger;
}

/**
 * API server plugin config
 */
 export type ApiServerConfig = CommonConfig<ApiServerContext>;

/**
 * API server plugin result
 */
export type ApiServerResult = CommonResult;

/**
 * UI plugin context
 */
export interface UiContext
{
  /**
   * Vite user config
   */
  config: UserConfig;

  /**
   * Vite config environment
   */
  env: ConfigEnv;
}

/**
 * UI plugin config
 */
export interface UiConfig extends CommonConfig<UiContext>
{
  /**
   * Filesystem merge entries (Used to merge plugin source code with the original UI source code)
   * 
   * * Keys: source merge path (Relative to the plugin entrypoint)
   * * Values: destination merge path (Relative to the merged directory)
   */
  merge?: Record<string, string>;
}

/**
 * UI plugin result
 */
export interface UiResult extends CommonResult
{
  /**
   * Plugin root directory
   */
  dir: string;

  /**
   * Filesystem merge entries (Used to merge plugin source code with the original UI source code)
   * 
   * * Keys: source merge path (Relative to the plugin entrypoint)
   * * Values: destination merge path (Relative to the merged directory)
   */
  merge?: Record<string, string>;
}