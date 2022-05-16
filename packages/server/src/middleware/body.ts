/**
 * @fileoverview Body parser middleware
 */

//Imports
import body from 'koa-body';

//Middleware
const middleware = body({
  multipart: true,
  text: false,
  urlencoded: false,
});

//Export
export default middleware;