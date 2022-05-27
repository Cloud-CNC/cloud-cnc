/**
 * @fileoverview Permissions middleware
 */

//Imports
// import Session from '@/lib/session';
// import {Role} from '@/models/role';
import {Context, Next} from 'koa';

//Middleware
const checkPermission = (_: string) => async (_: Context, next: Next) =>
{
  return next();
};

//Export
export default checkPermission;