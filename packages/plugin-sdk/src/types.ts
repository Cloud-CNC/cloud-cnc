/**
 * @fileoverview TypeScript types
 */

//Imports
import * as config from '@/server/lib/config';
import Koa from 'koa';
import {Hookable} from 'hookable';
import {Hooks} from '@/server/lib/hooks';
import {Logger} from 'pino';
import {SemVer} from 'semver';

/**
 * Plugin version checker callback
 * @param version Host Cloud CNC version
 */
export type PluginVersionChecker = (version: SemVer) => boolean | Promise<boolean>;

/**
 * Base app config
 */
export type ConfigType = typeof config;

/**
 * Entrypoint hookable instance type
 */
export type HookType = Hookable<Hooks>;

/**
 * Plugin SDK context
 */
export interface PluginSdkContext
{
  /**
   * Koa app
   */
  app: Koa

  /**
   * Base app config
   */
  config: ConfigType;

  /**
   * Hooks
   */
  hooks: HookType;

  /**
   * Pino logger
   */
  log: Logger;
}

/**
 * Plugin load handler
 * @param ctx Plugin context
 */
export type PluginLoadHandler = (ctx: PluginSdkContext) => void | Promise<void>;