/**
 * @fileoverview Permissions middleware
 */

//Imports
// import Session from '@/lib/session';
// import {Role} from '@/models/role';
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