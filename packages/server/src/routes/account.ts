/**
 * @fileoverview Account routes
 */

//Imports
import Joi from 'joi';
import Router from '@koa/router';
import checkPermission from '@/middleware/permission';
import safe from '@/middleware/safe';
import {
  getAllAccounts,
  createAccount,
  // impersonateAccount,
  getAccount,
  updateAccount,
  deleteAccount
} from '@/controllers/account';

//Router setup
const router = new Router();

//Register routes
router
  /**
   * Get all accounts
   */
  .get('/accounts/all', checkPermission('getAllAccounts'), safe(undefined, undefined, Joi.object({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).max(100).optional(),
    query: Joi.string().pattern(/^[ -~]{1,256}$/).optional()
  })), async ctx =>
  {
    //Get all accounts
    const res = await getAllAccounts(ctx.safe.query);

    //Return the accounts
    ctx.response.body = res;
  })

  /**
   * Create an account
   */
  .post('/accounts/create', checkPermission('createAccount'), safe(Joi.object({
    username: Joi.string().pattern(/^[A-Za-z0-9-_]{3,256}$/).required(),
    password: Joi.string().pattern(/^[ -~]{12,256}$/).required(),
    totpEnabled: Joi.boolean().required(),
    roles: Joi.array().items(Joi.string()).required(),
    pluginData: Joi.object().optional()
  }), undefined, undefined), async ctx =>
  {
    //Create the account
    const account = await createAccount(ctx.safe.body);

    //Return the account
    ctx.response.body = account;
  })

  /**
   * Start/stop impersonating an account
   */
  /*.post('/accounts/:id/impersonate', checkPermission('impersonateAccount'), safe(Joi.object({
    enabled: Joi.boolean().required()
  }), Joi.object({
    id: Joi.string().optional()
  }), undefined), async ctx =>
  {
    //TODO: fully invoke controller
    await impersonateAccount();
  })*/

  /**
   * Get an account
   */
  .get('/accounts/:id', checkPermission('getAccount'), safe(undefined, Joi.object({
    id: Joi.string().optional()
  }), undefined), async ctx =>
  {
    try
    {
      //Get the account
      const account = await getAccount(ctx.safe.params.id!);

      //Return the account
      ctx.response.body = account;
    }
    catch (error)
    {
      //Log
      ctx.log.error(error);

      //Set the response
      ctx.response.body = {
        error: {
          name: 'Invalid account!',
          description: 'The specified account is invalid!'
        }
      };
      ctx.response.status = 400;
    }
  })

  /**
   * Update an account
   */
  .patch('/accounts/:id', checkPermission('updateAccount'), safe(Joi.object({
    username: Joi.string().pattern(/^[A-Za-z0-9-_]{3,256}$/).optional(),
    password: Joi.string().pattern(/^[ -~]{12,256}$/).optional(),
    totpEnabled: Joi.boolean().optional(),
    roles: Joi.array().items(Joi.string()).optional(),
    pluginData: Joi.object().optional()
  }), Joi.object({
    id: Joi.string().optional()
  }), undefined), async ctx =>
  {
    try
    {
      //Update the account
      const account = await updateAccount(ctx.safe.params.id!, ctx.safe.body);

      //Return the account
      ctx.response.body = account;
    }
    catch (error)
    {
      //Log
      ctx.log.error(error);

      //Set the response
      ctx.response.body = {
        error: {
          name: 'Invalid account!',
          description: 'The specified account is invalid!'
        }
      };
      ctx.response.status = 400;
    }
  })

  /**
   * Delete an account
   */
  .delete('/accounts/:id', checkPermission('deleteAccount'), safe(undefined, Joi.object({
    id: Joi.string().optional()
  }), undefined), async ctx =>
  {
    try
    {
      //Delete the account
      await deleteAccount(ctx.safe.params.id!);

      //Return nothing
      ctx.response.body = null;
    }
    catch (error)
    {
      //Log
      ctx.log.error(error);

      //Set the response
      ctx.response.body = {
        error: {
          name: 'Invalid account!',
          description: 'The specified account is invalid!'
        }
      };
      ctx.response.status = 400;
    }
  });

//Export
export default router;