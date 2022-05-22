/**
 * @fileoverview Validation middleware
 */

//Imports
import {Next, ParameterizedContext} from 'koa';
import {Schema} from 'joi';

//Middleware
const validate = (schema: Schema) => (ctx: ParameterizedContext, next: Next) =>
{
  //Validate the body
  const res = schema.validate(ctx.request.body);

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

  return next();
};

//Export
export default validate;