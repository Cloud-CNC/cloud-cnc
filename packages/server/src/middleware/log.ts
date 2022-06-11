/**
 * @fileoverview Log middleware
 */

//Imports
import log from '@/server/lib/log';
import pino from 'koa-pino-logger';
import {Middleware} from 'koa';

//Middleware
const middleware = pino({
  logger: log,
  useLevel: 'trace'
}) as Middleware;

//Export
export default middleware;