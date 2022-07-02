/**
 * @fileoverview Session middleware
 */

//Imports
import redisStore from 'koa-redis';
import session from 'koa-session-minimal';
import {redisUrl} from '~/server/lib/config';

//Middleware
const middleware = session({
  cookie: {
    httpOnly: true,
    sameSite: 'strict'
  },
  key: 'session',
  store: redisUrl != null ? redisStore({
    url: redisUrl
  }) : undefined
});

//Export
export default middleware;