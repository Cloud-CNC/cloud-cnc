/**
 * @fileoverview App middleware
 */

//Imports
import body from './body';
import compose from 'koa-compose';
import error from './error';
import helmet from './helmet';
import log from './log';
import session from './session';

//Compose middleware
const middleware = compose([
  error,
  log,
  helmet,
  body,
  session
]);

//Export
export default middleware;