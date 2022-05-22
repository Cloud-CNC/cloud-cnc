/**
 * @fileoverview Permissions middleware
 */

//Imports
import Session from '@/lib/session';
import {Role} from '@/models/role';
import {Context, Next} from 'koa';

//Middleware
const checkPermission = (permission: string) => async (ctx: Context, next: Next) =>
{
  //Cast
  const session = ctx.session as Session

  //Get all account roles
  const roles = await Role.find({
    name: session.account.effective.roles
  });

  //Aggregate permissions
  const permissions = roles.flatMap(role => role.permissions)

  //Unauthorized requests
  if (!permissions.includes(permission))
  {
    //Log
    ctx.log.error({ctx, permission, permissions}, 'Unauthorized request!');

    //Reject
    ctx.throw({
      error: {
        name: 'Unauthorized request!',
        description: `This request requires the ${permission} permission!`
      }
    }, 401);
  }

  return next();
};

//Export
export default checkPermission;