/**
 * @fileoverview Account controller unit tests
 */

//Imports
import {accountA, accountB} from '!/fixtures/account';
import {Account, IAccount} from '@/models/account';
import {createSandbox} from 'sinon';
import {
  getAllAccounts,
  createAccount,
  // impersonateAccount,
  getAccount,
  updateAccount,
  deleteAccount
} from './account';
import hooks from '@/lib/hooks';
import test from 'ava';

//Sinon sandbox
const sandbox = createSandbox();
test.afterEach.always('Restore sandbox', () =>
{
  sandbox.restore();
});

//Tests
test.serial('Get all accounts', async ctx =>
{
  //Test data
  const output = [
    {
      id: accountA.id,
      username: accountA.username,
      totpEnabled: accountA.totpEnabled,
      roles: accountA.roles,
      pluginData: accountA.pluginData
    },
    {
      id: accountB.id,
      username: accountB.username,
      totpEnabled: accountB.totpEnabled,
      roles: accountB.roles,
      pluginData: accountB.pluginData
    }
  ];

  //Stub the callHook method
  const callHook = sandbox.stub(hooks, 'callHook').resolves();

  //Stub the toObject method
  const toObject = sandbox.stub()
    .onCall(0)
    .returns(output[0])
    .onCall(1)
    .returns(output[1]);

  //Stub the find method
  const find = sandbox.stub(Account, 'find')
    .resolves(Array(2).fill({
      toObject
    }));

  //Get all accounts
  const accounts = await getAllAccounts();

  //Ensure the result is expected
  ctx.deepEqual(accounts, output);
  ctx.assert(find.calledOnceWithExactly({}, {
    id: 1,
    username: 1,
    totpEnabled: 1,
    roles: 1,
    pluginData: 1
  }));
  ctx.assert(toObject.alwaysCalledWithExactly());
  ctx.assert(toObject.calledTwice);
  ctx.assert(callHook.getCall(0).calledWithExactly('getAllAccounts:pre'));
  ctx.assert(callHook.getCall(1).calledWithExactly('getAllAccounts:post', Array(2).fill({
    toObject
  })));
  ctx.assert(callHook.calledTwice);
});

test.serial('Create an account', async ctx =>
{
  //Test data
  const input = {
    username: accountA.username,
    password: accountA.password,
    totpEnabled: accountA.totpEnabled,
    roles: accountA.roles,
    pluginData: accountA.pluginData
  };

  const output = {
    id: accountA.id,
    totpSecret: accountA.totpSecret
  };

  //Stub the callHook method
  const callHook = sandbox.stub(hooks, 'callHook').resolves();

  //Stub the save method
  const save = sandbox.stub().resolves();

  //Stub the create method
  const create = sandbox.stub(Account, 'create')
    .resolves({
      id: accountA.id,
      save
    });

  //Create the account
  const account = await createAccount(input);

  //Ensure the result is expected
  ctx.deepEqual(account, output);
  //@ts-ignore Sinon types are outdated
  ctx.assert(create.calledOnceWithExactly({
    ...input,
    totpSecret: 'dummy-totp-secret'
  } as IAccount));
  ctx.assert(save.calledOnceWithExactly());
  ctx.assert(callHook.getCall(0).calledWithExactly('createAccount:pre', {
    ...input,
    totpSecret: 'dummy-totp-secret'
  } as IAccount));
  ctx.assert(callHook.getCall(1).calledWithExactly('createAccount:post', {
    id: accountA.id,
    save
  } as any));
  ctx.assert(callHook.calledTwice);
});

/*test.serial('Start/stop impersonating an account', async ctx =>
{
  //TODO: implement test
  impersonateAccount();
});*/

test.serial('Get an account', async ctx =>
{
  //Test data
  const output = {
    username: accountA.username,
    totpEnabled: accountA.totpEnabled,
    roles: accountA.roles,
    pluginData: accountA.pluginData
  };
  
  //Stub the callHook method
  const callHook = sandbox.stub(hooks, 'callHook').resolves();

  //Stub the toObject method
  const toObject = sandbox.stub().returns(output);

  //Stub the findById method
  const findById = sandbox.stub(Account, 'findById')
    .resolves({
      id: accountA.id,
      toObject
    });

  //Get the account
  const account = await getAccount(accountA.id);

  //Ensure the result is expected
  ctx.deepEqual(account, output);
  ctx.assert(findById.calledOnceWithExactly(accountA.id, {
    username: 1,
    totpEnabled: 1,
    roles: 1,
    pluginData: 1
  }));
  ctx.assert(toObject.alwaysCalledWithExactly());
  ctx.assert(toObject.calledOnce);
  ctx.assert(callHook.getCall(0).calledWithExactly('getAccount:pre', accountA.id));
  ctx.assert(callHook.getCall(1).calledWithExactly('getAccount:post', {
    id: accountA.id,
    toObject
  } as any));
  ctx.assert(callHook.calledTwice);
});

test.serial('Update an account', async ctx =>
{
  //Test data
  const input = {
    username: accountB.username,
    password: accountB.password,
    totpEnabled: accountB.totpEnabled,
    roles: accountB.roles,
    pluginData: accountB.pluginData
  };

  const output = {
    totpSecret: accountA.totpSecret
  };

  //Stub the callHook method
  const callHook = sandbox.stub(hooks, 'callHook').resolves();

  //Stub the toObject method
  const toObject = sandbox.stub().returns(output);

  //Stub the findByIdAndUpdate method
  const findByIdAndUpdate = sandbox.stub(Account, 'findByIdAndUpdate')
    .resolves({
      id: accountA.id,
      toObject
    });

  //Update the account
  const account = await updateAccount(accountA.id, input);

  //Ensure the result is expected
  ctx.deepEqual(account, output);
  ctx.assert(findByIdAndUpdate.calledOnceWithExactly(accountA.id, {
    $set: {
      ...input,
      totpSecret: undefined
    } as IAccount
  }, {
    new: true,
    projection: {
      totpSecret: 1
    }
  }));
  ctx.assert(toObject.alwaysCalledWithExactly());
  ctx.assert(toObject.calledOnce);
  ctx.assert(callHook.getCall(0).calledWithExactly('updateAccount:pre', {
    ...input,
    totpSecret: undefined
  } as IAccount));
  ctx.assert(callHook.getCall(1).calledWithExactly('updateAccount:post', {
    id: accountA.id,
    toObject
  } as any));
  ctx.assert(callHook.calledTwice);
});

test.serial('Delete an account', async ctx =>
{
  //Stub the callHook method
  const callHook = sandbox.stub(hooks, 'callHook').resolves();

  //Stub the findByIdAndDelete method
  const findByIdAndDelete = sandbox.stub(Account, 'findByIdAndDelete')
    .resolves({
      id: accountA.id
    });
  
  //Delete the account
  await deleteAccount(accountA.id);

  //Ensure the result is expected
  ctx.assert(findByIdAndDelete.calledOnceWithExactly(accountA.id));
  ctx.assert(callHook.getCall(0).calledWithExactly('deleteAccount:pre', accountA.id));
  ctx.assert(callHook.getCall(1).calledWithExactly('deleteAccount:post', {
    id: accountA.id
  } as any));
  ctx.assert(callHook.calledTwice);
});