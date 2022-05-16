/**
 * @fileoverview Unified account model
 */

//Imports
import Joi from 'joi';
import {model as createModel, Document} from 'mongoose';
import joigoose from '@/lib/joigoose';

//Typescript interface
interface typescriptInterface extends Document
{
  /**
   * Account username
   */
  username: string;

  /**
   * Account password
   */
  password: string;

  /**
   * Whether or not to request MFA (Note that the client MUST invoke `/accounts/verify-mfa` before MFA is enabled)
   */
  requestMfa: boolean;

  /**
   * Account roles
   */
  roles: string[];

  /**
   * Arbitrary plugin data
   * * Keys: plugin identifier (Plugins SHOULD use an RFC 3986 URN)
   * * Values: arbitrary, plugin-specific data (Plugins SHOULD only modify their respective data)
   */
  pluginData: object;

  /**
   * Whether to start impersonating or stop impersonating
   */
  enabled: boolean;
}

//Joi schema
const joiSchema = Joi.object({
  username: Joi.string(),
  password: Joi.string(),
  requestMfa: Joi.boolean(),
  roles: Joi.array().items(Joi.string()),
  pluginData: Joi.object(),
  enabled: Joi.boolean()
});

//Mongoose schema
const mongooseSchema = joigoose.convert(joiSchema);

//Mongoose model
const model = createModel<typescriptInterface>('accounts', mongooseSchema);

//Export
export {
  typescriptInterface as IAccount,
  joiSchema as AccountSchema,
  model as Account
};