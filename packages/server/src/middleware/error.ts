/**
 * @fileoverview Error handling middleware
 */

//Imports
import {Next} from 'koa';
import {RouterMiddlewareContext} from '@/server/lib/types';

/**
 * Error handling middleware
 * @param ctx Koa context
 * @param next Next middleware
 */
const error = async (ctx: RouterMiddlewareContext, next: Next) =>
{
  try
  {
    await next();
  }
  catch (err)
  {
    //Set the response
    ctx.response.body = {
      error: {
        name: 'Internal Server Error',
        description: 'An internal server error occurred. Check the server logs for more information.'
      }
    };
    ctx.response.status = 500;
  }
};

//Export
export default error;