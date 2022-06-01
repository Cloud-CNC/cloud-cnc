/**
 * @fileoverview Plugin hooks
 */

//Import
import {IAccount, IAccountDocument} from '@/models/account';
import {createHooks} from 'hookable';

//Hooks
interface Hooks
{
  //Account entity
  'getAllAccounts:pre': () => void | Promise<void>;
  'getAllAccounts:post': (accounts: IAccountDocument[]) => void | Promise<void>;
  'createAccount:pre': (create: Pick<IAccount, 'username' | 'password' | 'totpEnabled' | 'roles' | 'pluginData'>) => void | Promise<void>;
  'createAccount:post': (account: IAccountDocument) => void | Promise<void>;
  'impersonateAccount:pre': () => void | Promise<void>;
  'impersonateAccount:post': () => void | Promise<void>;
  'getAccount:pre': (id: string) => void | Promise<void>;
  'getAccount:post': (account: IAccountDocument) => void | Promise<void>;
  'updateAccount:pre': (update: Partial<Pick<IAccount, 'username' | 'password' | 'totpEnabled' | 'roles' | 'pluginData'>>) => void | Promise<void>;
  'updateAccount:post': (account: IAccountDocument) => void | Promise<void>;
  'deleteAccount:pre': (id: string) => void | Promise<void>;
  'deleteAccount:post': (account: IAccountDocument) => void | Promise<void>;
}

//Create the hookable instance
const hooks = createHooks<Hooks>();

//Export
export default hooks;