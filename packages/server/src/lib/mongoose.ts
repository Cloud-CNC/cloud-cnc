/**
 * @fileoverview Mongoose helper
 */

//Imports
import mongoose from 'mongoose';

/**
 * Connect to MongoDB
 * @param url MongoDB URL
 * @returns Mongoose instance
 */
export const connect = async (url: string) =>
{
  //Actually connect
  const instance = await mongoose.connect(url, {
    ignoreUndefined: false
  });

  return instance;
};

/**
 * Disconnect from MongoDB
 */
export const disconnect = async () => await mongoose.disconnect();