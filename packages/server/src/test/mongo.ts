/**
 * @fileoverview In-memory MongoDB testing utility
 */

//Imports
import {ExecutionContext} from 'ava';
import {MongoMemoryServer} from 'mongodb-memory-server';
import {connect, disconnect} from 'mongoose';

/**
 * Setup an in-memory MongoDB instance and connect Mongoose to it
 */
const setupMongo = async (ctx: ExecutionContext) =>
{
  //Launch an in-memory server
  const server = await MongoMemoryServer.create();

  //Get the Mongo URI
  const uri = server.getUri();

  //Connect Mongoose
  await connect(uri);

  //Register the teardown hook
  ctx.teardown(async () =>
  {
    //Disconnect Mongoose
    await disconnect();

    //Stop the in-memory server
    await server.stop();
  });
};

//Export
export default setupMongo;