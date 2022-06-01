/**
 * @fileoverview Account controller
 */

//Imports
import hooks from '@/lib/hooks';
import log from '@/lib/log';
import {Account, IAccount} from '@/models/account';
import {WithID} from '@/lib/types';

/**
 * Get all accounts
 */
const getAllAccounts = async (): Promise<WithID<Pick<IAccount, 'username' | 'totpEnabled' | 'roles' | 'pluginData'>>[]> =>
{
  //Invoke hook
  await hooks.callHook('getAllAccounts:pre');

  //Get all accounts
  const accounts = await Account.find({}, {
    id: 1,
    username: 1,
    totpEnabled: 1,
    roles: 1,
    pluginData: 1
  });

  //Invoke hook
  await hooks.callHook('getAllAccounts:post', accounts);

  //Log
  log.debug('Got all accounts.');

  return accounts.map(account => account.toObject());
};

/**
 * Create an account
 */
const createAccount = async (create: Pick<IAccount, 'username' | 'password' | 'totpEnabled' | 'roles' | 'pluginData'>): Promise<WithID<Pick<IAccount, 'totpSecret'>>> =>
{
  const data = {
    ...create,
    totpSecret: create.totpEnabled ? 'dummy-totp-secret' : undefined
  } as IAccount;

  //Invoke hook
  await hooks.callHook('createAccount:pre', data);

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
    totpSecret: 'dummy-totp-secret' //TODO: add data
  };
};

/**
 * Start/stop impersonating an account
 */
/*const impersonateAccount = async () =>
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
const getAccount = async (id: string): Promise<Pick<IAccount, 'username' | 'totpEnabled' | 'roles' | 'pluginData'>> =>
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
const updateAccount = async (id: string, update: Partial<Pick<IAccount, 'username' | 'password' | 'totpEnabled' | 'roles' | 'pluginData'>>): Promise<Pick<IAccount, 'totpSecret'>> =>
{
  const data = {
    ...update,
    totpSecret: update.totpEnabled ? 'dummy-totp-secret' : undefined
  } as IAccount;

  //Invoke hook
  await hooks.callHook('updateAccount:pre', data);

  //Get the account
  const account = await Account.findByIdAndUpdate(id, {
    $set: data
  }, {
    new: true,
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
const deleteAccount = async (id: string) =>
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

//Export
export {
  getAllAccounts,
  createAccount,
  // impersonateAccount,
  getAccount,
  updateAccount,
  deleteAccount
};