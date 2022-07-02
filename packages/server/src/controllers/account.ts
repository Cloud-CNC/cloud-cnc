/**
 * @fileoverview Account controller
 */

//Imports
import generateQuery from '~/server/lib/search';
import log from '~/server/lib/log';
import {Account, IAccount} from '~/server/models/account';
import {Filter, OperationContext, WithID, WithPagination} from '~/server/lib/types';
import {hooks} from '~/server/lib/hooks';

/**
 * Get all accounts
 * @param filter Query filter
 * @param ctx Koa context
 */
export const getAllAccounts = async (filter: Filter, ctx: OperationContext): Promise<WithPagination<'accounts', WithID<Pick<IAccount, 'username' | 'totpEnabled' | 'disabled' | 'roles' | 'pluginData'>>[]>> =>
{
  //Invoke hook
  await hooks.callHook('getAllAccounts:pre', filter, ctx);

  //Generate the query
  const query = filter.query != null ? generateQuery<IAccount>(filter.query, [
    'username'
  ]) : {};

  //Get all accounts
  const result = await Account.paginate(query, {
    page: filter.page ?? 1,
    projection: {
      id: 1,
      username: 1,
      totpEnabled: 1,
      disabled: 1,
      roles: 1,
      pluginData: 1
    },
    limit: filter.limit ?? 25
  });

  //Invoke hook
  await hooks.callHook('getAllAccounts:post', result, ctx);

  //Log
  log.debug('Got all accounts.');

  return {
    accounts: result.docs.map(account => account.toObject()),
    page: result.page!,
    pages: result.totalPages
  };
};

/**
 * Create an account
 * @param filter Query filter
 * @param ctx Koa context
 */
export const createAccount = async (data: Pick<IAccount, 'username' | 'password' | 'totpEnabled' | 'disabled' | 'roles' | 'pluginData'>, ctx: OperationContext): Promise<WithID<Pick<IAccount, 'totpSecret'>>> =>
{
  //Add TOTP secret
  if (data.totpEnabled)
  {
    (data as IAccount).totpSecret = 'GPQMMPERPHKDUHBHUPJAILWXXVWQENOTNOTIAHHGEMRPTCQQYASR';
  }

  //Invoke hook
  await hooks.callHook('createAccount:pre', data, ctx);

  //Create the account
  const account = await Account.create(data);

  //Save the account
  await account.save();

  //Invoke hook
  await hooks.callHook('createAccount:post', account, ctx);

  //Log
  log.debug(`Created account ${account.id}.`);

  return {
    id: account.id,
    totpSecret: data.totpEnabled ? 'GPQMMPERPHKDUHBHUPJAILWXXVWQENOTNOTIAHHGEMRPTCQQYASR' : undefined //TODO: add data
  };
};

/**
 * Start/stop impersonating an account
 * @param filter Query filter
 * @param ctx Koa context
 */
/*export const impersonateAccount = async (ctx: OperationContext) =>
{
  //Invoke hook
  //TODO: add hook arguments
  await hooks.callHook('impersonateAccount:pre', ctx);

  //TODO: implement business logic

  //Invoke hook
  //TODO: add hook arguments
  await hooks.callHook('impersonateAccount:post', ctx);

  //TODO: log
};*/

/**
 * Get an account
 * @param id Account ID
 * @param filter Query filter
 * @param ctx Koa context
 */
export const getAccount = async (id: string, ctx: OperationContext): Promise<Pick<IAccount, 'username' | 'totpEnabled' | 'disabled' | 'roles' | 'pluginData'>> =>
{
  //Invoke hook
  await hooks.callHook('getAccount:pre', id, ctx);

  //Get the account
  const account = await Account.findById(id, {
    username: 1,
    totpEnabled: 1,
    disabled: 1,
    roles: 1,
    pluginData: 1
  });

  //Ensure the account exists
  if (account == null)
  {
    throw new Error(`Invalid account with ID ${id}!`);
  }

  //Invoke hook
  await hooks.callHook('getAccount:post', account, ctx);

  //Log
  log.debug(`Got account ${account.id}.`);

  return account.toObject();
};

/**
 * Update an account
 * @param id Account ID
 * @param filter Query filter
 * @param ctx Koa context
 */
export const updateAccount = async (id: string, data: Partial<Pick<IAccount, 'totp' | 'username' | 'password' | 'totpEnabled' | 'disabled' | 'roles' | 'pluginData'>>, ctx: OperationContext): Promise<Pick<IAccount, 'totpSecret'>> =>
{
  //Add TOTP secret
  if (data.totpEnabled != null)
  {
    (data as IAccount).totpSecret = data.totpEnabled ? 'GPQMMPERPHKDUHBHUPJAILWXXVWQENOTNOTIAHHGEMRPTCQQYASR': undefined;
  }

  //Invoke hook
  await hooks.callHook('updateAccount:pre', id, data, ctx);

  //Update the account
  const account = await Account.findByIdAndUpdate(id, data, {
    new: true,
    overwrite: true,
    projection: {
      totpSecret: 1
    }
  });

  //Ensure the account exists
  if (account == null)
  {
    throw new Error(`Invalid account with ID ${id}!`);
  }

  //Invoke hook
  await hooks.callHook('updateAccount:post', account, ctx);

  //Log
  log.debug(`Updated account ${account.id}.`);

  return account.toObject();
};

/**
 * Delete an account
 * @param id Account ID
 * @param filter Query filter
 * @param ctx Koa context
 */
export const deleteAccount = async (id: string, data: Pick<IAccount, 'totp'>, ctx: OperationContext) =>
{
  //Invoke hook
  await hooks.callHook('deleteAccount:pre', id, data, ctx);

  //Get the account
  const account = await Account.findByIdAndDelete(id);

  //Ensure the account exists
  if (account == null)
  {
    throw new Error(`Invalid account with ID ${id}!`);
  }

  //Invoke hook
  await hooks.callHook('deleteAccount:post', account, ctx);

  //Log
  log.debug(`Deleted account ${account.id}.`);
};
