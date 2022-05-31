/**
 * @fileoverview Server entrypoint
 */

//Imports
// import plugin from '@/lib/plugin';
// import socket from '@/socket';
import app from '@/routes/index';
import generateServer from '@/lib/server';
import log from '@/lib/log';
import {connect} from 'mongoose';
import {mode, http, mongoUrl} from '@/lib/config';

const main = async () =>
{
  //Get the app HTTP handler
  const handler = app.callback();

  //Generate the server
  const server = generateServer(handler);

  //SocketIO setup
  // const io = socket(server);

  //Apply plugins
  // await plugin(app, io);

  //Connect to Mongo
  await connect(mongoUrl!);

  //Start the server
  server.listen(http.port);

  //Log
  log.info(`Started Cloud CNC core on port ${http.port}. Running in ${mode} mode.`);
};

main();