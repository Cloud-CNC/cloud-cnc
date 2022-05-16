/**
 * @fileoverview Mongoose connection helper
 */

//Imports
import {connect} from 'mongoose';
import {mongoUrl} from '@/lib/config';

//Export
export default async () =>
{
  //Connect to Mongo
  await connect(mongoUrl!);
};