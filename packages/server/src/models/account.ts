/**
 * @fileoverview Unified account model
 */

//Imports
import Joi from 'joi';
import {Document, model as createModel} from 'mongoose';
import joigoose from '@/lib/joigoose';

//Account interface
interface IAccount
{
  /**
   * Whether to start impersonating or stop impersonating
   */
  enabled: boolean;

  /**
   * Account password
   */
  password: string;

  /**
   * Arbitrary plugin data
   * * Keys: plugin identifier (Plugins SHOULD use an RFC 3986 URI)
   * * Values: arbitrary, plugin-specific data (Plugins SHOULD only modify their respective data)
   */
  pluginData?: object;

  /**
   * Account roles
   */
  roles: string[];

  /**
   * Whether or not TOTP is enabled
   */
  totpEnabled: boolean;

  /**
   * TOTP secret (Only present if TOTP is enabled)
   */
  totpSecret?: string;

  /**
   * Account username
   */
  username: string;
}

//Joi schema
const AccountSchema = Joi.object({
  enabled: Joi.boolean().required(),
  password: Joi.string().min(12).required(),
  pluginData: Joi.object().optional(),
  roles: Joi.array().items(Joi.string()).required(),
  totpEnabled: Joi.boolean().required(),
  totpSecret: Joi.string().optional(),
  username: Joi.string().required().meta({
    _mongoose: {
      unique: true
    }
  })
});

//Mongoose model
const Account = createModel<IAccount>('accounts', joigoose.convert(AccountSchema));
Account.schema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: (document: Document<any, any, IAccount>, value: any) =>
  {
    //Delete the Object ID
    delete value._id;

    //Delete the stringified ID if not specifically selected for
    if (!document.isSelected('id'))
    {
      delete value.id;
    }
  }
});

//Export
export {
  IAccount,
  AccountSchema,
  Account
};