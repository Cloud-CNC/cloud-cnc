/**
 * @fileoverview Log middleware
 */

//Imports
import pino from 'koa-pino-logger';
import log from '@/lib/log';

//Middleware
const middleware = pino({
  logger: log,
  serializers: {
    req: req => ({
      id: req.id,
      method: req.method,
      url: req.url,
      remoteAddress: req.remoteAddress,
      remotePort: req.remotePort
    })
  }
});

//Export
export default middleware;