/**
 * @fileoverview Unified account model
 */

//Imports
import mongoosePaginate from 'mongoose-paginate-v2';
import mongoose from 'mongoose';
import joigoose from '~/server/lib/joigoose';
import Joi from 'joi';

//Account interface
export interface IAccount
{
  /**
   * Account password
   */
  password: string;

  /**
   * Account role IDs
   */
  roles: string[];

  /**
   * Account username
   */
  username: string;

  /**
   * Arbitrary plugin data
   * * Keys: plugin identifier (Plugins SHOULD use an RFC 3986 URI)
   * * Values: arbitrary, plugin-specific data (Plugins SHOULD only modify their respective data)
   */
  pluginData?: object;

  /**
   * TOTP (Required if TOTP is enabled and changing the password or disabling TOTP)
   */
  totp?: string;

  /**
   * TOTP secret (Only present if TOTP is enabled)
   */
  totpSecret?: string;

  /**
   * Whether or not TOTP is enabled
   */
  totpEnabled: boolean;

  /**
   * Whether or not the account is disabled
   */
  disabled: boolean;
}

//Account document
export type IAccountDocument = IAccount & mongoose.Document<unknown, any, IAccount>;

//Account Joi schema
export const AccountJoiSchema = Joi.object({
  password: Joi.string().pattern(/^[ -~]{12,256}$/).meta({
    _mongoose: {
      searchable: false
    }
  }).required(),
  roles: Joi.array().items(Joi.string().meta({
    _mongoose: {
      searchable: false,
      // type: 'ObjectId',
      // ref: null //TODO: add collection name
    }
  })).required(),
  username: Joi.string().pattern(/^[A-Za-z0-9-_]{3,256}$/).meta({
    _mongoose: {
      searchable: true
    }
  }).required(),
  pluginData: Joi.object().optional(),
  totp: Joi.string().pattern(/^[0-9]{6}$/).meta({
    _mongoose: {
      searchable: false
    }
  }).optional(),
  totpSecret: Joi.string().pattern(/^[A-Z2-7]{52}$/).meta({
    _mongoose: {
      searchable: false
    }
  }).optional(),
  totpEnabled: Joi.boolean().required(),
  disabled: Joi.boolean().required()
});

//Account Mongoose schema
export const AccountMongooseSchema = new mongoose.Schema(joigoose.convert(AccountJoiSchema) as any);
AccountMongooseSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: (document: IAccountDocument, value: any) =>
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
AccountMongooseSchema.plugin(mongoosePaginate);

//Account model
export const Account = mongoose.model<IAccount, mongoose.PaginateModel<IAccount>>('accounts', AccountMongooseSchema);