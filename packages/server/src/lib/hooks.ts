/**
 * @fileoverview Plugin hooks
 */

//Import
import {Filter} from '@/server/lib/types';
import {PaginateResult} from 'mongoose';
import {createHooks} from 'hookable';

//Models
import {IAccount, IAccountDocument} from '@/server/models/account';

//Hooks
export interface Hooks
{
  //Account entity
  /**
   * Ran before `getAllAccounts`
   */
  'getAllAccounts:pre': (filter: Filter) => void | Promise<void>;

  /**
   * Ran after `getAllAccounts`
   */
  'getAllAccounts:post': (accounts: PaginateResult<IAccountDocument>) => void | Promise<void>;

  /**
   * Ran before `createAccount`
   */
  'createAccount:pre': (create: Pick<IAccount, 'username' | 'password' | 'totpEnabled' | 'roles' | 'pluginData'>) => void | Promise<void>;

  /**
   * Ran after `createAccount`
   */
  'createAccount:post': (account: IAccountDocument) => void | Promise<void>;

  /**
   * Ran before `impersonateAccount`
   */
  'impersonateAccount:pre': () => void | Promise<void>;

  /**
   * Ran after `impersonateAccount`
   */
  'impersonateAccount:post': () => void | Promise<void>;

  /**
   * Ran before `getAccount`
   */
  'getAccount:pre': (id: string) => void | Promise<void>;

  /**
   * Ran after `getAccount`
   */
  'getAccount:post': (account: IAccountDocument) => void | Promise<void>;

  /**
   * Ran before `updateAccount`
   */
  'updateAccount:pre': (id: string, update: Partial<Pick<IAccount, 'username' | 'password' | 'totpEnabled' | 'roles' | 'pluginData'>>) => void | Promise<void>;

  /**
   * Ran after `updateAccount`
   */
  'updateAccount:post': (account: IAccountDocument) => void | Promise<void>;

  /**
   * Ran before `deleteAccount`
   */
  'deleteAccount:pre': (id: string) => void | Promise<void>;

  /**
   * Ran after `deleteAccount`
   */
  'deleteAccount:post': (account: IAccountDocument) => void | Promise<void>;
}

//Create the hookable instance
export const hooks = createHooks<Hooks>();