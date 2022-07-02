/**
 * @fileoverview Koa routes
 */

//Imports
import Koa from 'koa';
import middleware from '~/server/middleware';

//Routes
import account from '~/server/routes/account';

//Koa setup
const app = new Koa();

//Register routes
app
  //Middleware
  .use(middleware)

  //Account routes
  .use(account.routes())
  .use(account.allowedMethods());

//Export
export default app;