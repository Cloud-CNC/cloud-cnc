/**
 * @fileoverview Ephemeral MongoDB utility
 */

//Imports
import {MongoMemoryServer} from 'mongodb-memory-server';
import {connect as mongooseConnect, disconnect as mongooseDisconnect} from '@/server/lib/mongoose';
import {connection} from 'mongoose';

//MongoDB server used for all tests
const server = new MongoMemoryServer();

/**
 * Start the database
 */
export const start = async () =>
{
  //Start the server
  await server.start();

  //Get the Mongo URI
  const uri = server.getUri();

  //Connect Mongoose
  await mongooseConnect(uri);
};

/**
 * Stop the database
 */
export const stop = async () =>
{
  //Disconnect Mongoose
  await mongooseDisconnect();

  //Stop the server
  await server.stop();
};

/**
 * Reset the database
 */
export const reset = async () =>
{
  //Drop all collections
  for (const collection of Object.values(connection.collections))
  {
    await collection.drop();
  }
};