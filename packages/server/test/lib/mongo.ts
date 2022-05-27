/**
 * @fileoverview Ephemeral MongoDB utility
 */

//Imports
import {MongoMemoryServer} from 'mongodb-memory-server';
import {
  connect as connectMongoose,
  connection,
  disconnect as disconnectMongoose
} from 'mongoose';

//MongoDB server used for all tests
const server = new MongoMemoryServer();

/**
 * Start the database
 */
const start = async () =>
{
  //Start the server
  await server.start();

  //Get the Mongo URI
  const uri = server.getUri();

  //Connect Mongoose
  await connectMongoose(uri);
};

/**
 * Stop the database
 */
const stop = async () =>
{
  //Disconnect Mongoose
  await disconnectMongoose();

  //Stop the server
  await server.stop();
}

/**
 * Reset the database
 */
const reset = async () =>
{
  //Drop all collections
  for (const collection of Object.values(connection.collections))
  {
    await collection.drop();
  }
}

//Export
export {
  start,
  stop,
  reset
};