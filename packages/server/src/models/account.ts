/**
 * @fileoverview Unified account model
 */

//Imports
import Joi from 'joi';
import joigoose from '@/server/lib/joigoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import {Document, PaginateModel, Schema, model as createModel} from 'mongoose';

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
   * TOTP secret (Only present if TOTP is enabled)
   */
  totpSecret?: string;

  /**
   * Whether or not TOTP is enabled
   */
  totpEnabled: boolean;
}

//Account document
export type IAccountDocument = Document<unknown, any, IAccount>;

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
  totpSecret: Joi.string().pattern(/^[A-Z2-7]{52}$/).meta({
    _mongoose: {
      searchable: false
    }
  }).optional(),
  totpEnabled: Joi.boolean().required()
});

//Account Mongoose schema
export const AccountMongooseSchema = new Schema(joigoose.convert(AccountJoiSchema) as any);
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
export const Account = createModel<IAccount, PaginateModel<IAccount>>('accounts', AccountMongooseSchema);