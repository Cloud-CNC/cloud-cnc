/**
 * @fileoverview App log
 */

//Imports
import pino, {DestinationStream} from 'pino';
import pretty from 'pino-pretty';
import {log} from '@/server/lib/config';

//Generate the stream
let stream: DestinationStream;
if (log.pretty)
{
  stream = pretty({
    sync: true
  });
}

//Setup the logger
const logger = pino({
  formatters: {
    level: label => ({level: label})
  },
  level: log.level
}, stream!);

//Export
export default logger;