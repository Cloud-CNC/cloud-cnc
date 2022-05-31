/**
 * @fileoverview Account route integration tests
 */

//Imports
import app from  '@/routes/index';
import request from 'supertest';
import test from 'ava';
import {accountA, accountB} from '!/fixtures/account';
import {Account} from '@/models/account';
import {start, stop, reset} from '!/lib/mongo';

//Ephemeral MongoDB
test.before('Start MongoDB', start);
test.afterEach('Reset MongoDB', reset);
test.after('Stop MongoDB', stop);

//Tests
test.serial('Get all accounts', async ctx =>
{
  //Create the accounts
  const accountDocumentA = await Account.create(accountA);
  const accountDocumentB = await Account.create(accountB);

  //Save the accounts
  await accountDocumentA.save();
  await accountDocumentB.save();

  //Make the request
  const res = await request(app.callback())
    .get('/accounts/all');

  //Ensure the response is expected
  ctx.assert(res.headers['content-type'].includes('application/json'));
  ctx.deepEqual(res.body, [
    {
      id: accountDocumentA.id,
      username: accountA.username,
      totpEnabled: accountA.totpEnabled,
      roles: accountA.roles,
      pluginData: accountA.pluginData
    },
    {
      id: accountDocumentB.id,
      username: accountB.username,
      totpEnabled: accountB.totpEnabled,
      roles: accountB.roles,
      pluginData: accountB.pluginData
    }
  ]);
  ctx.is(res.status, 200);
});

test.serial('Create an account', async ctx =>
{
  //Make the request
  const res = await request(app.callback())
    .post('/accounts/create')
    .set('content-type', 'application/json')
    .send({
      username: accountA.username,
      password: accountA.password,
      totpEnabled: accountA.totpEnabled,
      roles: accountA.roles,
      pluginData: accountA.pluginData
    });

  //Ensure the response is expected
  ctx.assert(res.headers['content-type'].includes('application/json'));
  ctx.assert(res.body.id.length > 0);
  ctx.is(res.body.totpSecret, accountA.totpSecret);
  ctx.is(res.status, 200);

  //Get the account
  const accountDocument = await Account.findById(res.body.id, {
    enabled: 1,
    password: 1,
    pluginData: 1,
    roles: 1,
    totpEnabled: 1,
    totpSecret: 1,
    username: 1
  })  as Record<string, any>;

  //Ensure the document exists
  ctx.assert(accountDocument != null);

  //Ensure the account was created correctly
  ctx.deepEqual(accountDocument.enabled, accountA.enabled);
  ctx.deepEqual(accountDocument.password, accountA.password);
  ctx.deepEqual(accountDocument.pluginData, accountA.pluginData);
  ctx.deepEqual(accountDocument.roles, accountA.roles);
  ctx.deepEqual(accountDocument.totpEnabled, accountA.totpEnabled);
  ctx.deepEqual(accountDocument.totpSecret, accountA.totpSecret);
  ctx.deepEqual(accountDocument.username, accountA.username);
});

test.serial('Start/stop impersonating an account', async ctx =>
{
  //TODO: setup the database

  //Make the request
  const res = await request(app.callback())
    //TODO: add path parameters
    .post('/accounts/:id/impersonate')
    .set('content-type', 'application/json')
    .send({
      //TODO: add request body
    });

  //Ensure the response is expected
  ctx.is(res.status, 204);
  //TODO: ensure the database was updated correctly
});

test.serial('Get an account', async ctx =>
{
  //Create the account
  const accountDocument = await Account.create(accountA);

  //Save the account
  await accountDocument.save();

  //Make the request
  const res = await request(app.callback())
    .get(`/accounts/${accountDocument.id}`);

  //Ensure the response is expected
  ctx.assert(res.headers['content-type'].includes('application/json'));
  ctx.deepEqual(res.body, {
    id: accountDocument.id,
    username: accountA.username,
    totpEnabled: accountA.totpEnabled,
    roles: accountA.roles,
    pluginData: accountA.pluginData
  });
  ctx.is(res.status, 200);
});

test.serial('Update an account', async ctx =>
{
  //Create the account
  const accountDocument = await Account.create(accountA);

  //Save the account
  await accountDocument.save();

  //Make the request
  const res = await request(app.callback())
    .patch(`/accounts/${accountDocument.id}`)
    .set('content-type', 'application/json')
    .send({
      username: accountB.username,
      password: accountB.password,
      totpEnabled: accountB.totpEnabled,
      roles: accountB.roles,
      pluginData: accountB.pluginData
    });

  //Ensure the response is expected
  ctx.assert(res.headers['content-type'].includes('application/json'));
  ctx.deepEqual(res.body, {
    id: accountDocument.id,
    totpSecret: accountB.totpSecret
  });
  ctx.is(res.status, 200);

  //Get the account
  const updatedAccountDocument = await Account.findById(res.body.id, {
    enabled: 1,
    password: 1,
    pluginData: 1,
    roles: 1,
    totpEnabled: 1,
    totpSecret: 1,
    username: 1
  }) as Record<string, any>;

  //Ensure the document exists
  ctx.assert(updatedAccountDocument != null);

  //Ensure the account was created correctly
  ctx.deepEqual(updatedAccountDocument.enabled, accountB.enabled);
  ctx.deepEqual(updatedAccountDocument.password, accountB.password);
  ctx.deepEqual(updatedAccountDocument.pluginData, accountB.pluginData);
  ctx.deepEqual(updatedAccountDocument.roles, accountB.roles);
  ctx.deepEqual(updatedAccountDocument.totpEnabled, accountB.totpEnabled);
  ctx.deepEqual(updatedAccountDocument.totpSecret, accountB.totpSecret);
  ctx.deepEqual(updatedAccountDocument.username, accountB.username);
});

test.serial('Delete an account', async ctx =>
{
  //Create the account
  const accountDocument = await Account.create(accountA);

  //Save the account
  await accountDocument.save();

  //Make the request
  const res = await request(app.callback())
    .delete(`/accounts/${accountDocument.id}`);

  //Ensure the response is expected
  ctx.is(res.status, 204);

  //Ensure the account was deleted correctly
  ctx.assert(await Account.findById(accountDocument.id, {}) == null);
});