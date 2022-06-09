/**
 * @fileoverview Plugin hooks
 */

//Import
import {Filter} from '@/lib/types';
import {PaginateResult} from 'mongoose';
import {createHooks} from 'hookable';

//Models
import {IAccount, IAccountDocument} from '@/models/account';

//Hooks
interface Hooks
{
  //Account entity
  'getAllAccounts:pre': (filter: Filter) => void | Promise<void>;
  'getAllAccounts:post': (accounts: PaginateResult<IAccountDocument>) => void | Promise<void>;
  'createAccount:pre': (create: Pick<IAccount, 'username' | 'password' | 'totpEnabled' | 'roles' | 'pluginData'>) => void | Promise<void>;
  'createAccount:post': (account: IAccountDocument) => void | Promise<void>;
  'impersonateAccount:pre': () => void | Promise<void>;
  'impersonateAccount:post': () => void | Promise<void>;
  'getAccount:pre': (id: string) => void | Promise<void>;
  'getAccount:post': (account: IAccountDocument) => void | Promise<void>;
  'updateAccount:pre': (id: string, update: Partial<Pick<IAccount, 'username' | 'password' | 'totpEnabled' | 'roles' | 'pluginData'>>) => void | Promise<void>;
  'updateAccount:post': (account: IAccountDocument) => void | Promise<void>;
  'deleteAccount:pre': (id: string) => void | Promise<void>;
  'deleteAccount:post': (account: IAccountDocument) => void | Promise<void>;
}

//Create the hookable instance
const hooks = createHooks<Hooks>();

//Export
export default hooks;