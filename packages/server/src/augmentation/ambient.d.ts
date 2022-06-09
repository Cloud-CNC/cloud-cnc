/**
 * @fileoverview Ambient type augmentation
 * 
 * **NOTE: DO NOT PUT ANY IMPORTS AT THE TOP LEVEL!***
 */

declare module 'mongoose'
{
  /**
   * Search model helper
   */
  interface SearchModel<T, TQueryHelpers = {}, TMethods = {}> extends Model<T, TQueryHelpers, TMethods>
  {
    /**
     * Generate a search query
     * @param str Search query
     * @param fields Override default fields to search against
     * 
     * @see https://github.com/cme-pro/mongoose-search/blob/master/src/mongoose-search.ts
     */
    searchQuery: (str: string, options?: {fields?: Record<string, boolean>}) => FilterQuery<T>
  }
}