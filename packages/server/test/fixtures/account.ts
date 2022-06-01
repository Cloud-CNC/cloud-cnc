/**
 * @fileoverview Account fixtures
 */

//Imports
import {IAccount} from '@/models/account';
import {WithID} from '@/lib/types';

//Fixtures
//TODO: add realistic data
const accountA = {
  id: '62971075fb647cd2b8fc6ab0',
  password: 'a bad password',
  pluginData: {
    a: 'b'
  },
  roles: [
    'admin'
  ],
  totpEnabled: true,
  totpSecret: 'dummy-totp-secret',
  username: 'janedoe'
} as WithID<IAccount>;

const accountB = {
  id: '6297107b04ee177988f9bc46',
  password: 'another bad password',
  pluginData: {
    c: 'd'
  },
  roles: [
    'users'
  ],
  totpEnabled: false,
  totpSecret: 'dummy-totp-secret',
  username: 'johndoe'
} as WithID<IAccount>;

//Export
export {
  accountA,
  accountB
};