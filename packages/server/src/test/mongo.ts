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
 * Connect to the database
 */
const connect = async () =>
{
  //Start the server
  await server.start();

  //Get the Mongo URI
  const uri = server.getUri();

  //Connect Mongoose
  await connectMongoose(uri);
};

/**
 * Disconnect from the database
 */
const disconnect = async () =>
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
  connect,
  disconnect,
  reset
};