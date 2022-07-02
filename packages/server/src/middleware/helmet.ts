/**
 * @fileoverview Helmet security middleware
 */

//Imports
import compose from 'koa-compose';
import helmet from 'koa-helmet';
import {http} from '~/server/lib/config';

//Middleware
const middlewares = [
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ['\'self\'']
    }
  }),
  helmet.referrerPolicy({
    policy: 'no-referrer'
  }),
  helmet.noSniff(),
  helmet.ieNoOpen(),
  helmet.frameguard({
    action: 'deny'
  }),
  helmet.permittedCrossDomainPolicies({
    permittedPolicies: 'none'
  }),
  helmet.xssFilter()
];

//TLS-only middleware
if (http.tls)
{
  middlewares.push(
    helmet.expectCt({
      enforce: true,
      maxAge: 86400
    }),
    helmet.hsts({
      includeSubDomains: false,
      maxAge: 15552000
    })
  );
}

//Compose
const middleware = compose(middlewares);

//Export
export default middleware;