/**
 * @fileoverview App middleware
 */

//Imports
import compose from 'koa-compose';
import session from './session';
import body from './body';
import helmet from './helmet';
import log from './log';
import sanitize from './sanitize';

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