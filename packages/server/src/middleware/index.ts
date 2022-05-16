/**
 * @fileoverview App middleware
 */

//Imports
import compose from 'koa-compose';
import session from '@/middleware/session';
import body from '@/middleware/body';
import helmet from '@/middleware/helmet';
import log from '@/middleware/log';
import sanitize from '@/middleware/sanitize';

//Compose middleware
const middleware = compose([
  log,
  helmet,
  body,
  sanitize,
  session
]);

//Export
export default middleware;