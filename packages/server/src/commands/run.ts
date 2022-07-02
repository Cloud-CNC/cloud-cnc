/**
 * @fileoverview Run command
 */

//Imports
// import plugin from '~/server/lib/plugin';
// import socket from '~/server/socket';
import app from '~/server/routes/index';
import createServer from '~/server/lib/server';
import log from '~/server/lib/log';
import {program} from 'commander';
import {connect} from '~/server/lib/mongoose';
import {mode, http, mongoUrl} from '~/server/lib/config';

//Register the command
program
  .command('run')
  .description('run the API server. Environment variables must be configured prior to running this command.')
  .action(async () =>
  {
    //Get the app HTTP handler
    const handler = app.callback();

    //Create the server
    const server = await createServer(handler);

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
  });