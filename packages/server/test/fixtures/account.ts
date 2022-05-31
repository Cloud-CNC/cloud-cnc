/**
 * @fileoverview Account fixtures
 */

//Imports
import {IAccount} from '@/models/account';
import {WithID} from '@/lib/types';

//Fixtures
//TODO: add realistic data
const accountA = {
  id: '',
  enabled: null,
  password: null,
  pluginData: null,
  roles: null,
  totpEnabled: null,
  totpSecret: null,
  username: null
} as WithID<IAccount>;

const accountB = {
  id: '',
  enabled: null,
  password: null,
  pluginData: null,
  roles: null,
  totpEnabled: null,
  totpSecret: null,
  username: null
} as WithID<IAccount>;

//Export
export {
  accountA,
  accountB
};