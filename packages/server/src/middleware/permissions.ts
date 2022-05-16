/**
 * @fileoverview Permissions middleware
 */

//Imports
import {Context, Next} from 'koa';

//Middleware
const validate = (name: string) => (ctx: Context, next: Next) =>
{
  console.log(ctx.session.);

  //Invalid requests
  if (res.error != null)
  {
    //Log
    ctx.log.error({ctx, res}, 'Invalid request!');

    //Reject
    ctx.throw({
      error: {
        name: 'Invalid request!',
        description: res.error
      }
    }, 400);
  }

  //Suspect requests
  if (res.warning != null)
  {
    //Log
    ctx.log.warn({ctx, res}, 'Suspect request!');
  }
};

//Export
export default validate;