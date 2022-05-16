/**
 * @fileoverview Session middleware
 */

//Imports
import MongoSessionStore from '@/lib/session-store';
import session from 'koa-generic-session';

//Middleware
const middleware = session({
  cookie: {
    httpOnly: true,
    sameSite: 'strict'
  },
  key: 'session',
  store: new MongoSessionStore()
});

//Export
export default middleware;