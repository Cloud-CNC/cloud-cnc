/**
 * @fileoverview TypeScript types
 */

//Imports
import * as config from '~/server/lib/config';
import Koa from 'koa';
import {Hookable} from 'hookable';
import {Hooks as ApiHooks} from '~/server/lib/hooks';
import {Logger} from 'pino';

/**
 * API server context
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
  config: typeof config;

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
 * Unified plugin contexts
 */
export type PluginContexts = ApiServerContext;

/**
 * Unified plugin configuration
 */
export interface PluginConfig<T>
{
  /**
   * Plugin name
   * @default Package name
   */
  name: string;

  /**
   * Plugin loaded handler
   * @param ctx Plugin context
   */
  onLoad: (ctx: T) => void | Promise<void>;
}

/**
 * Unified plugin
 * 
 * *Note: if you're a plugin developer, you probably shouldn't use this!*
 * @param hostVersion Host Cloud CNC version
 * @param ctx Plugin context
 */
export type Plugin = (hostVersion: string, ctx: PluginContexts) => Promise<void>;