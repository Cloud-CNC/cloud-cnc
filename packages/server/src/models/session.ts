/**
 * @fileoverview Unified session model
 */

//Imports
import {model as createModel, Document, Schema} from 'mongoose';

//Typescript interface
interface typescriptInterface extends Document
{
  /**
   * Session expiration timestamp
   */
  expiresAt: Date;

  /**
   * Session ID
   */
  sid: string;

  /**
   * Session data
   */
  data: any;
}


//Mongoose schema
const mongooseSchema = new Schema<typescriptInterface>({
  expiresAt: {
    type: Date
  },
  sid: {
    type: String,
    required: true
  },
  data: {
    type: Object,
    required: true
  }
});

mongooseSchema.index({
  'expiresAt': 1
}, {
  expireAfterSeconds: 0
});

//Mongoose model
const model = createModel<typescriptInterface>('sessions', mongooseSchema);

//Export
export {
  typescriptInterface as ISession,
  model as Session
};