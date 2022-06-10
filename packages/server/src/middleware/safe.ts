/**
 * @fileoverview Safe input middleware
 */

//Imports
import {Next} from 'koa';
import {ObjectSchema} from 'joi';
import {RouterMiddlewareContext} from '@/lib/types';
import {sanitize} from 'mongodb-sanitize';

/**
 * Validate the value against the schema
 * @param schema Joi schema
 * @param value Value to validate
 * @returns Validated value
 */
const validateSchema = (schema: ObjectSchema, value: any) =>
{
  //Validate the request value
  const res = schema.validate(value);

  //Invalid requests
  if (res.error != null)
  {
    throw res.error;
  }
  //Suspect requests
  else if (res.warning != null)
  {
    throw res.warning;
  }

  return res.value;
};

/**
 * Safe input middleware factory
 * 
 * **NOTE: you MUST access request data via `ctx.safe` (instead of `ctx` or `ctx.request`) to get
 * sanitized and validated data!**
 * @param body Joi body schema
 * @param params Joi path parameters schema
 * @param query Joi query parameters schema
 * @returns Sanitization and validation middleware
 */
const validate = (body?: ObjectSchema, params?: ObjectSchema, query?: ObjectSchema) => (ctx: RouterMiddlewareContext, next: Next) =>
{
  //Sanitize request data
  ctx.safe = {
    body: ctx.request.body != null ? sanitize(ctx.request.body) : undefined,
    params: ctx.params != null ? sanitize(ctx.params) : undefined,
    query: ctx.request.query != null ? sanitize(ctx.request.query) : undefined,
  };

  //Validate request data
  try
  {
    if (body != null)
    {
      ctx.safe.body = validateSchema(body, ctx.safe.body);
    }

    if (params != null)
    {
      ctx.safe.params = validateSchema(params, ctx.safe.params);
    }

    if (query != null)
    {
      ctx.safe.query = validateSchema(query, ctx.safe.query);
    }
  }
  catch (error)
  {
    //Log
    ctx.log.error({ctx, error}, 'Invalid request!');

    //Set the response
    ctx.response.body = {
      error: {
        name: 'Invalid request!',
        description: error
      }
    };
    ctx.response.status = 400;

    //Abort middleware execution
    return;
  }

  return next();
};

//Export
export default validate;