/**
 * @fileoverview Account controller
 */

//Imports
import hooks from '@/lib/hooks';
import log from '@/lib/log';
import {Account, IAccount} from '@/models/account';
import {Filter, WithID, WithPagination} from '@/lib/types';

/**
 * Get all accounts
 */
export const getAllAccounts = async (filter: Filter): Promise<WithPagination<'accounts', WithID<Pick<IAccount, 'username' | 'totpEnabled' | 'roles' | 'pluginData'>>[]>> =>
{
  //Invoke hook
  await hooks.callHook('getAllAccounts:pre', filter);

  //Generate the query
  const query = filter.query != null ? Account.searchQuery(filter.query) : {};

  //Get all accounts
  const result = await Account.paginate(query, {
    page: filter.page ?? 1,
    projection: {
      id: 1,
      username: 1,
      totpEnabled: 1,
      roles: 1,
      pluginData: 1
    },
    limit: filter.limit ?? 25
  });

  //Invoke hook
  await hooks.callHook('getAllAccounts:post', result);

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
 */
export const createAccount = async (create: Pick<IAccount, 'username' | 'password' | 'totpEnabled' | 'roles' | 'pluginData'>): Promise<WithID<Pick<IAccount, 'totpSecret'>>> =>
{
  const data = create as IAccount;
  if (create.totpEnabled)
  {
    data.totpSecret = 'GPQMMPERPHKDUHBHUPJAILWXXVWQENOTNOTIAHHGEMRPTCQQYASR';
  }

  //Invoke hook
  await hooks.callHook('createAccount:pre', create);

  //Create the account
  const account = await Account.create(data);

  //Save the account
  await account.save();

  //Invoke hook
  await hooks.callHook('createAccount:post', account);

  //Log
  log.debug(`Created account ${account.id}.`);

  return {
    id: account.id,
    totpSecret: create.totpEnabled ? 'GPQMMPERPHKDUHBHUPJAILWXXVWQENOTNOTIAHHGEMRPTCQQYASR' : undefined //TODO: add data
  };
};

/**
 * Start/stop impersonating an account
 */
/*export const impersonateAccount = async () =>
{
  //Invoke hook
  //TODO: add hook arguments
  await hooks.callHook('impersonateAccount:pre');

  //TODO: implement business logic

  //Invoke hook
  //TODO: add hook arguments
  await hooks.callHook('impersonateAccount:post');

  //TODO: log
};*/

/**
 * Get an account
 */
export const getAccount = async (id: string): Promise<Pick<IAccount, 'username' | 'totpEnabled' | 'roles' | 'pluginData'>> =>
{
  //Invoke hook
  await hooks.callHook('getAccount:pre', id);

  //Get the account
  const account = await Account.findById(id, {
    username: 1,
    totpEnabled: 1,
    roles: 1,
    pluginData: 1
  });

  //Ensure the account exists
  if (account == null)
  {
    throw new Error(`Invalid account with ID ${id}!`);
  }

  //Invoke hook
  await hooks.callHook('getAccount:post', account);

  //Log
  log.debug(`Got account ${account.id}.`);

  return account.toObject();
};

/**
 * Update an account
 */
export const updateAccount = async (id: string, update: Partial<Pick<IAccount, 'username' | 'password' | 'totpEnabled' | 'roles' | 'pluginData'>>): Promise<Pick<IAccount, 'totpSecret'>> =>
{
  const data = update as IAccount;
  if (update.totpEnabled != null)
  {
    data.totpSecret = update.totpEnabled ? 'GPQMMPERPHKDUHBHUPJAILWXXVWQENOTNOTIAHHGEMRPTCQQYASR' : undefined;
  }

  //Invoke hook
  await hooks.callHook('updateAccount:pre', id, data);

  //Get the account
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
  await hooks.callHook('updateAccount:post', account);

  //Log
  log.debug(`Updated account ${account.id}.`);

  return account.toObject();
};

/**
 * Delete an account
 */
export const deleteAccount = async (id: string) =>
{
  //Invoke hook
  await hooks.callHook('deleteAccount:pre', id);

  //Get the account
  const account = await Account.findByIdAndDelete(id);

  //Ensure the account exists
  if (account == null)
  {
    throw new Error(`Invalid account with ID ${id}!`);
  }

  //Invoke hook
  await hooks.callHook('deleteAccount:post', account);

  //Log
  log.debug(`Deleted account ${account.id}.`);
};