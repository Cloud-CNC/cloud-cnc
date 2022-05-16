/**
 * @fileoverview Account routes
 */

//Imports
import Router from '@koa/router';
import {DefaultState} from 'koa';
import {AccountContext, 
  getAllAccounts,
  createAccount,
  impersonateAccount,
  getAccount,
  updateAccount,
  deleteAccount
} from '@/controllers/account';
import {Account} from '@/models/account';

//Router setup
const router = new Router<DefaultState, AccountContext>();

//Register routes
router
  //Route level accounts
  .param('id', async (id, ctx: AccountContext, next) =>
  {
    //Get the account by its id
    const account = await Account.findById(id);

    //Ensure the account is valid
    if (account == null)
    {
      //Log
      ctx.log.error({ctx, id}, 'Invalid account id!');

      //Reject
      ctx.throw({
        error: {
          name: 'Invalid account id!',
          description: 'The supplied account id is invalid.'
        }
      }, 400);
    }

    //Update the account
    ctx.state.account = account;

    return next();
  })

  /**
   * Get all accounts
   */
  .get('/accounts/all', getAllAccounts)

  /**
   * Create an account
   */
  .post('/accounts/create', createAccount)

  /**
   * Start/stop impersonating an account
   */
  .post('/accounts/{id}/impersonate', impersonateAccount)

  /**
   * Get an account
   */
  .get('/accounts/{id}', getAccount)

  /**
   * Update an account
   */
  .patch('/accounts/{id}', updateAccount)

  /**
   * Delete an account
   */
  .delete('/accounts/{id}', deleteAccount);

//Export
export default router;