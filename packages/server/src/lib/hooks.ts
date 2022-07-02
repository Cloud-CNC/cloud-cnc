/**
 * @fileoverview Plugin hooks
 */

//Import
import mongoose from 'mongoose';
import {Filter, OperationContext} from '~/server/lib/types';
import {createHooks} from 'hookable';

//Models
import {IAccount, IAccountDocument} from '~/server/models/account';

//Hooks
export interface Hooks
{
  //Account entity
  /**
   * Ran before `getAllAccounts`
   */
  'getAllAccounts:pre': (filter: Filter, ctx: OperationContext) => void | Promise<void>;

  /**
   * Ran after `getAllAccounts`
   */
  'getAllAccounts:post': (accounts: mongoose.PaginateResult<IAccountDocument>, ctx: OperationContext) => void | Promise<void>;

  /**
   * Ran before `createAccount`
   */
  'createAccount:pre': (data: Pick<IAccount, 'username' | 'password' | 'totpEnabled' | 'disabled' | 'roles' | 'pluginData'>, ctx: OperationContext) => void | Promise<void>;

  /**
   * Ran after `createAccount`
   */
  'createAccount:post': (account: IAccountDocument, ctx: OperationContext) => void | Promise<void>;

  /**
   * Ran before `impersonateAccount`
   */
  'impersonateAccount:pre': (ctx: OperationContext) => void | Promise<void>;

  /**
   * Ran after `impersonateAccount`
   */
  'impersonateAccount:post': (ctx: OperationContext) => void | Promise<void>;

  /**
   * Ran before `getAccount`
   */
  'getAccount:pre': (id: string, ctx: OperationContext) => void | Promise<void>;

  /**
   * Ran after `getAccount`
   */
  'getAccount:post': (account: IAccountDocument, ctx: OperationContext) => void | Promise<void>;

  /**
   * Ran before `updateAccount`
   */
  'updateAccount:pre': (id: string, data: Partial<Pick<IAccount, 'totp' | 'username' | 'password' | 'totpEnabled' | 'disabled' | 'roles' | 'pluginData'>>, ctx: OperationContext) => void | Promise<void>;

  /**
   * Ran after `updateAccount`
   */
  'updateAccount:post': (account: IAccountDocument, ctx: OperationContext) => void | Promise<void>;

  /**
   * Ran before `deleteAccount`
   */
  'deleteAccount:pre': (id: string, data: Pick<IAccount, 'totp'>, ctx: OperationContext) => void | Promise<void>;

  /**
   * Ran after `deleteAccount`
   */
  'deleteAccount:post': (account: IAccountDocument, ctx: OperationContext) => void | Promise<void>;
}

//Create the hookable instance
export const hooks = createHooks<Hooks>();