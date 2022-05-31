/**
 * @fileoverview App middleware
 */

//Imports
import body from './body';
import compose from 'koa-compose';
import error from './error';
import helmet from './helmet';
import log from './log';
import sanitize from './sanitize';
import session from './session';

//Compose middleware
const middleware = compose([
  error,
  log,
  helmet,
  body,
  sanitize,
  session
]);

//Export
export default middleware;