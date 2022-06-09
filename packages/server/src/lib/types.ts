/**
 * @fileoverview Typescript types
 */

//Imports
import {Context, DefaultContext, DefaultState, ExtendableContext} from 'koa';
import {RouterParamContext} from '@koa/router';

/**
 * Router middleware context
 */
export type RouterMiddlewareContext = ExtendableContext & RouterParamContext<DefaultState, DefaultContext & Context>;

/**
 * Entity query filter
 */
export interface Filter
{
  /**
   * Fuzzy-search query
   */
  query?: string;

  /**
   * Page number (Starting with `1`)
   */
  page?: number;
  
  /**
   * Maximum items per page (Default is `25`)
   */
  limit?: number;
}

/**
 * Add an `id` property to T
 */
export type WithID<T> = T & {
  /**
   * ID
   */
  id: string;
}

/**
 * Create a composite object with `K: T`, `page` and `pages`
 */
export type WithPagination<K extends keyof any, T> = {
  [P in K]: T;
} & {
  /**
   * Current page number. If this is equal to `1`, then this is the first page; if this is equal to
   * `pages`, then this is the last page.
   */
  page: number;

  /**
   * Total page count
   */
  pages: number;
}