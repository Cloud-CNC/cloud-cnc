/**
 * @fileoverview Account fixtures
 */

//Imports
import {IAccount} from '@/models/account';
import {WithID} from '@/lib/types';

//Fixtures
//TODO: add realistic data
export const accountA = {
  id: '62a042d5c73356f44f4fb91b',
  password: 'aaaaaaaaaaaa',
  roles: [
    'admin'
  ],
  username: 'jane-doe',
  pluginData: {
    key: 'v1'
  },
  totpSecret: 'GPQMMPERPHKDUHBHUPJAILWXXVWQENOTNOTIAHHGEMRPTCQQYASR',
  totpEnabled: true
} as WithID<IAccount>;

export const accountB = {
  id: '62a042d8728196393c8e6f21',
  password: 'bbbbbbbbbbbb',
  roles: [
    'user'
  ],
  username: 'john-doe',
  pluginData: {
    key: 'v2'
  },
  totpSecret: undefined,
  totpEnabled: false
} as WithID<IAccount>;