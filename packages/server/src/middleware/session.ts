/**
 * @fileoverview Session middleware
 */

//Imports
import redisStore from 'koa-redis';
import session from 'koa-session-minimal';
import {redisUrl} from '@/lib/config';

//Middleware
const middleware = session({
  cookie: {
    httpOnly: true,
    sameSite: 'strict'
  },
  key: 'session',
  store: redisStore({
    url: redisUrl
  })
});

//Export
export default middleware;