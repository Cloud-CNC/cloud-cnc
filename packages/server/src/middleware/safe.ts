/**
 * @fileoverview Safe input middleware
 */

//Imports
import {Next} from 'koa';
import {ObjectSchema} from 'joi';
import {RouterMiddlewareContext} from '@/lib/types';
import {sanitize} from 'mongodb-sanitize';

/**
 * Validate the value against the schema and emit errors via the Koa context
 * @param schema Joi schema
 * @param value Value to validate
 * @param ctx Koa context
 * @returns Validated value
 */
const validateSchema = (schema: ObjectSchema, value: any, ctx: RouterMiddlewareContext) =>
{
  //Validate the request value
  const res = schema.validate(value);

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
  if (body != null)
  {
    ctx.safe.body = validateSchema(body, ctx.safe.body, ctx);
  }

  if (params != null)
  {
    ctx.safe.params = validateSchema(params, ctx.safe.params, ctx);
  }

  if (query != null)
  {
    ctx.safe.query = validateSchema(query, ctx.safe.query, ctx);
  }

  return next();
};

//Export
export default validate;