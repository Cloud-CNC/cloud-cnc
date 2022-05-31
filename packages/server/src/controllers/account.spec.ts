/**
 * @fileoverview Account controller unit tests
 */

//Imports
import test from 'ava';
import {accountA, accountB} from '!/fixtures/account';
import {Account} from '@/models/account';
import {createSandbox} from 'sinon';
import {
  getAllAccounts,
  createAccount,
  impersonateAccount,
  getAccount,
  updateAccount,
  deleteAccount
} from './account';

//Sinon sandbox
const sandbox = createSandbox();
test.afterEach('Restore sandbox', () =>
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

  //Stub the toObject method
  const toObject = sandbox.stub()
    .withArgs()
    .onCall(0)
    .returns(output[0])
    .onCall(1)
    .returns(output[1]);

  //Stub the find method
  const find = sandbox.stub(Account, 'find')
    .withArgs({}, {
      id: 1,
      username: 1,
      totpEnabled: 1,
      roles: 1,
      pluginData: 1
    })
    .resolves(Array(2).fill({
      toObject
    }));

  //Get all accounts
  const accounts = await getAllAccounts();

  //Ensure the result is expected
  ctx.deepEqual(accounts, output);
  ctx.assert(find.calledOnce);
  ctx.assert(toObject.calledTwice);
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

  //Stub the save method
  const save = sandbox.stub()
    .withArgs()
    .resolves();

  //Stub the create method
  const create = sandbox.stub(Account, 'create')
    //@ts-ignore Sinon types are outdated
    .withArgs(input)
    .resolves({
      id: accountA.id,
      save
    });

  //Create the account
  const account = await createAccount(input);

  //Ensure the result is expected
  ctx.deepEqual(account, output);
  ctx.assert(create.calledOnce);
  ctx.assert(save.calledOnce);
});

test.serial('Start/stop impersonating an account', async ctx =>
{
  //TODO: implement test
  impersonateAccount();
});

test.serial('Get an account', async ctx =>
{
  //Test data
  const output = {
    username: accountA.username,
    totpEnabled: accountA.totpEnabled,
    roles: accountA.roles,
    pluginData: accountA.pluginData
  };

  //Stub the toObject method
  const toObject = sandbox.stub()
    .withArgs()
    .returns(output);

  //Stub the findById method
  const findById = sandbox.stub(Account, 'findById')
    .withArgs(accountA.id, {
      username: 1,
      totpEnabled: 1,
      roles: 1,
      pluginData: 1
    })
    .resolves({
      id: accountA.id,
      toObject
    });

  //Get the account
  const account = await getAccount(accountA.id);

  //Ensure the result is expected
  ctx.deepEqual(account, output);
  ctx.assert(findById.calledOnce);
  ctx.assert(toObject.calledOnce);
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

  //Stub the updateOne method
  const updateOne = sandbox.stub()
    .withArgs(input)
    .resolves();

  //Stub the toObject method
  const toObject = sandbox.stub()
    .withArgs()
    .returns(output);

  //Stub the findById method
  const findById = sandbox.stub(Account, 'findById')
    .withArgs(accountA.id, {
      totpSecret: 1
    })
    .resolves({
      id: accountA.id,
      toObject,
      updateOne
    });

  //Update the account
  const account = await updateAccount(accountA.id, input);

  //Ensure the result is expected
  ctx.deepEqual(account, output);
  ctx.assert(findById.calledOnce);
  ctx.assert(updateOne.calledOnce);
  ctx.assert(toObject.calledOnce);
});

test.serial('Delete an account', async ctx =>
{
  //Stub the delete method
  const _delete = sandbox.stub()
    .withArgs()
    .resolves();

  //Stub the findById method
  const findById = sandbox.stub(Account, 'findById')
    .withArgs(accountA.id)
    .resolves({
      id: accountA.id,
      delete: _delete
    });
  
  //Delete the account
  await deleteAccount(accountA.id);

  //Ensure the result is expected
  ctx.assert(findById.calledOnce);
  ctx.assert(_delete.calledOnce);
});