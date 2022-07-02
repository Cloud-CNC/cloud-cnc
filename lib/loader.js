/**
 * @fileoverview Custom loader that supports TS Node with TypeScript path aliases
 * 
 * @see https://github.com/TypeStrong/ts-node/discussions/1450#discussioncomment-1806115
 * @see https://github.com/TypeStrong/ts-node/discussions/1450#discussioncomment-1945596
 */

//Imports
import {createMatchPath, loadConfig} from 'tsconfig-paths';
import {pathToFileURL} from 'url';
import {resolve as tsResolve} from 'ts-node/esm';

//Load the TypeScript config
const {absoluteBaseUrl, paths} = loadConfig();

//Create a patch matcher
const pathMatcher = createMatchPath(absoluteBaseUrl, paths)

/**
 * Resolve hook
 * 
 * @see https://nodejs.org/api/esm.html#resolvespecifier-context-defaultresolve
 * 
 * @param {string} specifier 
 * @param {{
 *   conditions: string[];
 *   importAssertions: object;
 *   parentURL?: string;
 * }} ctx 
 * @param {Function} defaultResolve 
 * @returns {{
 *   format?: string | null;
 *   url: string;
 * }}
 */
export const resolve = (specifier, ctx, defaultResolve) =>
{
  //Match the path
  const match = pathMatcher(specifier);

  //Resolve using the matched path
  if (match != null)
  {
    return tsResolve(pathToFileURL(`${match}`).href, ctx, defaultResolve);
  }
  //Resolve using the default
  else
  {
    return tsResolve(specifier, ctx, defaultResolve);
  }
};

//Re-exports
export {load, getFormat, transformSource} from 'ts-node/esm';