/**
 * @fileoverview Permissions middleware
 */

//Imports
// import Session from '~/server/lib/session';
// import {Role} from '~/server/models/role';
import {Context, Next} from 'koa';

/**
 * Permission check middleware factory
 * @param name Permission name
 * @returns Middleware
 */
const checkPermission = (name: string) => async (_: Context, next: Next) =>
{
  //TODO: remove the placeholder and implement this middleware
  name;

  return next();
};

//Export
export default checkPermission;