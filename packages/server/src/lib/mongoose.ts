/**
 * @fileoverview Mongoose helper
 */

//Imports
import {connect as mongooseConnect, disconnect as mongooseDisconnect} from 'mongoose';

/**
 * Connect to MongoDB
 * @param url MongoDB URL
 * @returns Mongoose instance
 */
export const connect = async (url: string) =>
{
  //Actually connect
  const mongoose = await mongooseConnect(url, {
    ignoreUndefined: false
  });

  return mongoose;
};

/**
 * Disconnect from MongoDB
 */
export const disconnect = async () => await mongooseDisconnect();