/**
 * @fileoverview Account model
 */

//Imports
import {ParameterizedContext} from 'koa';
import validate from '../lib/validate';
import {IAccount, AccountSchema, Account} from '@/models/account';

//Controller context
export interface AccountContext extends ParameterizedContext
{
  state: {
    /**
     * User accounts
    */
    account: IAccount;
  };
}

/**
 * Get all accounts
 */
const getAllAccounts = async (ctx: AccountContext) =>
{
  //Ensure the account is valid
  if (ctx.state.account == null)
  {
    //Log
    ctx.log.error(ctx, 'Invalid account!');

    //Reject
    ctx.throw({
      error: {
        name: 'Invalid account!',
        description: 'The supplied account was invalid.'
      }
    }, 400);
  }

  //Find and return all accounts
  ctx.response.body = await Account.find();

  //Log
  ctx.log.info('Got all accounts.');
};

/**
 * Create an account
 */
const createAccount = async (ctx: AccountContext) =>
{
  //Ensure the account is valid
  if (ctx.state.account == null)
  {
    //Log
    ctx.log.error(ctx, 'Invalid account!');

    //Reject
    ctx.throw({
      error: {
        name: 'Invalid account!',
        description: 'The supplied account was invalid.'
      }
    }, 400);
  }

  //Instantiate the model
  const account = await Account.create(ctx.request.body);

  //Save the model
  await account.save();

  //Return the model
  ctx.response.body = {
    id: account.id
  };

  //Log
  ctx.log.info(`Created account ${account.id}.`);
};

/**
 * Start/stop impersonating an account
 */
const impersonateAccount = (ctx: AccountContext) =>
{
  //TODO: implement business logic
};

/**
 * Get an account
 */
const getAccount = (ctx: AccountContext) =>
{
  //Validate the body
  validate(AccountSchema, ctx);

  //Return the model
  ctx.response.body = ctx.state.account;

  //Log
  ctx.log.info(`Got account ${ctx.state.account.id}.`);
};

/**
 * Update an account
 */
const updateAccount = async (ctx: AccountContext) =>
{
  //Ensure the account is valid
  if (ctx.state.account == null)
  {
    //Log
    ctx.log.error(ctx, 'Invalid account!');

    //Reject
    ctx.throw({
      error: {
        name: 'Invalid account!',
        description: 'The supplied account was invalid.'
      }
    }, 400);
  }

  //Validate the body
  validate(AccountSchema, ctx);

  //Update the model
  await ctx.state.account.update(ctx.request.body as object);

  //Log
  ctx.log.info(`Updated account ${ctx.state.account.id}.`);
};

/**
 * Delete an account
 */
const deleteAccount = async (ctx: AccountContext) =>
{
  //Ensure the account is valid
  if (ctx.state.account == null)
  {
    //Log
    ctx.log.error(ctx, 'Invalid account!');

    //Reject
    ctx.throw({
      error: {
        name: 'Invalid account!',
        description: 'The supplied account was invalid.'
      }
    }, 400);
  }

  //Validate the body
  validate(AccountSchema, ctx);

  //Delete the model
  await ctx.state.account.delete();

  //Log
  ctx.log.info(`Deleted account ${ctx.state.account.id}.`);
};


//Export
export {
  getAllAccounts,
  createAccount,
  impersonateAccount,
  getAccount,
  updateAccount,
  deleteAccount
};