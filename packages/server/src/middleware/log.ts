/**
 * @fileoverview Log middleware
 */

//Imports
import pino from 'koa-pino-logger';
import log from '@/lib/log';

//Middleware
const middleware = pino({
  logger: log,
  useLevel: 'trace'
});

//Export
export default middleware;