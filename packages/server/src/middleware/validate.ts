/**
 * @fileoverview Validation middleware
 */

//Imports
import {Next, ParameterizedContext} from 'koa';
import {ObjectSchema, object} from 'joi';
import {pick} from 'lodash';

/**
 * Body validation middleware factory
 * @param entitySchema Joi entity schema
 * @param keys Keys from the entity schema used to generate the operation-specific sub-schema
 * @returns Middleware
 */
const validate = (entitySchema: ObjectSchema, keys: string[]) => (ctx: ParameterizedContext, next: Next) =>
{
  //Generate the sub-schema
  const subSchema = object(pick(entitySchema, keys));

  //Validate the body
  const res = subSchema.validate(ctx.request.body);

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