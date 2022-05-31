/**
 * @fileoverview Account controller
 */

//Imports
import log from '@/lib/log';
import {Account, IAccount} from '@/models/account';
import {WithID} from '@/lib/types';
import {hash} from '@/lib/password';
import {generate} from '@/lib/totp';

/**
 * Get all accounts
 */
const getAllAccounts = async (): Promise<WithID<Pick<IAccount, 'username' | 'totpEnabled' | 'roles' | 'pluginData'>>[]> =>
{
  //Get all accounts
  const accounts = await Account.find({}, {
    id: 1,
    username: 1,
    totpEnabled: 1,
    roles: 1,
    pluginData: 1
  });

  //Log
  log.info('Got all accounts.');

  return accounts.map(account => account.toObject());
};

/**
 * Create an account
 */
const createAccount = async (create: Pick<IAccount, 'username' | 'password' | 'totpEnabled' | 'roles' | 'pluginData'>): Promise<WithID<Pick<IAccount, 'totpSecret'>>> =>
{
  //Hash the password
  const password = await hash(create.password);

  //Generate the TOTP secret
  let totpSecret: string | undefined;
  if (create.totpEnabled)
  {
    totpSecret = generate();
  }

  //Create the account
  const account = await Account.create({
    ...create,
    enabled: true,
    password,
    totpSecret
  });

  //Save the account
  await account.save();

  //Log
  log.info(`Created account ${account.id}.`);

  return {
    id: account.id,
    totpSecret
  };
};

/**
 * Start/stop impersonating an account
 */
const impersonateAccount = () =>
{
  //TODO: implement business logic

  //TODO: log
};

/**
 * Get an account
 */
const getAccount = async (id: string): Promise<Pick<IAccount, 'username' | 'totpEnabled' | 'roles' | 'pluginData'>> =>
{
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

  //Log
  log.info(`Got account ${account.id}.`);

  return account.toObject();
};

/**
 * Update an account
 */
const updateAccount = async (id: string, update: Partial<Pick<IAccount, 'username' | 'password' | 'totpEnabled' | 'roles' | 'pluginData'>>): Promise<Pick<IAccount, 'totpSecret'>> =>
{
  //Hash the password
  let password: string | undefined;
  if (update.password != null)
  {
    password = await hash(update.password);
  }

  //Generate the TOTP secret
  let totpSecret: string | undefined;
  if (update.totpEnabled)
  {
    totpSecret = generate();
  }

  //Get the account
  const account = await Account.findByIdAndUpdate(id, {
    $set: {
      ...update,
      password,
      totpSecret
    }
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

  //Log
  log.info(`Updated account ${account.id}.`);

  return account.toObject();
};

/**
 * Delete an account
 */
const deleteAccount = async (id: string) =>
{
  //Get the account
  const account = await Account.findByIdAndDelete(id);

  //Ensure the account exists
  if (account == null)
  {
    throw new Error(`Invalid account with ID ${id}!`);
  }

  //Log
  log.info(`Deleted account ${account.id}.`);
};

//Export
export
{
  getAllAccounts,
  createAccount,
  impersonateAccount,
  getAccount,
  updateAccount,
  deleteAccount
};