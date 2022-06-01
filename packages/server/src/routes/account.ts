/**
 * @fileoverview Account routes
 */

//Imports
import Joi from 'joi';
import Router from '@koa/router';
import checkPermission from '@/middleware/permission';
import validate from '@/middleware/validate';
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
  .get('/accounts/all', checkPermission('getAllAccounts'), async ctx =>
  {
    //Get all accounts
    const accounts = await getAllAccounts();

    //Return the accounts
    ctx.response.body = accounts;
  })

  /**
   * Create an account
   */
  .post('/accounts/create', checkPermission('createAccount'), validate(Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(12).required(),
    totpEnabled: Joi.boolean().required(),
    roles: Joi.array().items(Joi.string()).required(),
    pluginData: Joi.object().optional()
  })), async ctx =>
  {
    //Create the account
    const account = await createAccount(ctx.request.body);

    //Return the account
    ctx.response.body = account;
  })

  /**
   * Start/stop impersonating an account
   */
  /*.post('/accounts/:id/impersonate', checkPermission('impersonateAccount'), async ctx =>
  {
    //TODO: fully invoke controller
    await impersonateAccount();
  })*/

  /**
   * Get an account
   */
  .get('/accounts/:id', checkPermission('getAccount'), async ctx =>
  {
    try
    {
      //Get the account
      const account = await getAccount(ctx.params.id!);

      //Return the account
      ctx.response.body = account;
    }
    catch (error)
    {
      //Log
      ctx.log.error(error);

      //Reject
      ctx.throw({
        error: {
          name: 'Invalid account!',
          description: 'The specified account is invalid!'
        }
      }, 400);
    }
  })

  /**
   * Update an account
   */
  .patch('/accounts/:id', checkPermission('updateAccount'), validate(Joi.object({
    username: Joi.string().optional(),
    password: Joi.string().min(12).optional(),
    totpEnabled: Joi.boolean().optional(),
    roles: Joi.array().items(Joi.string()).optional(),
    pluginData: Joi.object().optional()
  })), async ctx =>
  {
    try
    {
      //Update the account
      const account = await updateAccount(ctx.params.id!, ctx.request.body);

      //Return the account
      ctx.response.body = account;
    }
    catch (error)
    {
      //Log
      ctx.log.error(error);

      //Reject
      ctx.throw({
        error: {
          name: 'Invalid account!',
          description: 'The specified account is invalid!'
        }
      }, 400);
    }
  })

  /**
   * Delete an account
   */
  .delete('/accounts/:id', checkPermission('deleteAccount'), async ctx =>
  {
    try
    {
      //Delete the account
      await deleteAccount(ctx.params.id!);

      //Return nothing
      ctx.response.body = null;
    }
    catch (error)
    {
      //Log
      ctx.log.error(error);

      //Reject
      ctx.throw({
        error: {
          name: 'Invalid account!',
          description: 'The specified account is invalid!'
        }
      }, 400);
    }
  });

//Export
export default router;