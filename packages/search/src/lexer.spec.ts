/**
 * @fileoverview Chevrotain lexer unit tests
 */

//Imports
import lexer from './lexer';
import test from 'ava';
import {tokenMatcher} from 'chevrotain';
import {And, ClosingParanthesis, Not, OpeningParanthesis, Or, Quote, String} from './tokens';

//Tests
test('Tokenize AND', ctx =>
{
  //Tokenize the text
  const result = lexer.tokenize('AND');

  //Ensure the result is expected
  ctx.is(result.errors.length, 0);
  ctx.deepEqual(result.groups, {});
  ctx.is(result.tokens.length, 1);
  ctx.assert(tokenMatcher(result.tokens[0]!, And));
});

test('Tokenize OR', ctx =>
{
  //Tokenize the text
  const result = lexer.tokenize('OR');

  //Ensure the result is expected
  ctx.is(result.errors.length, 0);
  ctx.deepEqual(result.groups, {});
  ctx.is(result.tokens.length, 1);
  ctx.assert(tokenMatcher(result.tokens[0]!, Or));
});

test('Tokenize NOT', ctx =>
{
  //Tokenize the text
  const result = lexer.tokenize('NOT');

  //Ensure the result is expected
  ctx.is(result.errors.length, 0);
  ctx.deepEqual(result.groups, {});
  ctx.is(result.tokens.length, 1);
  ctx.assert(tokenMatcher(result.tokens[0]!, Not));
});

test('Tokenize opening paranthesis', ctx =>
{
  //Tokenize the text
  const result = lexer.tokenize('(');

  //Ensure the result is expected
  ctx.is(result.errors.length, 0);
  ctx.deepEqual(result.groups, {});
  ctx.is(result.tokens.length, 1);
  ctx.assert(tokenMatcher(result.tokens[0]!, OpeningParanthesis));
});

test('Tokenize closing paranthesis', ctx =>
{
  //Tokenize the text
  const result = lexer.tokenize(')');

  //Ensure the result is expected
  ctx.is(result.errors.length, 0);
  ctx.deepEqual(result.groups, {});
  ctx.is(result.tokens.length, 1);
  ctx.assert(tokenMatcher(result.tokens[0]!, ClosingParanthesis));
});

test('Tokenize single quote', ctx =>
{
  //Tokenize the text
  const result = lexer.tokenize('\'');

  //Ensure the result is expected
  ctx.is(result.errors.length, 0);
  ctx.deepEqual(result.groups, {});
  ctx.is(result.tokens.length, 1);
  ctx.assert(tokenMatcher(result.tokens[0]!, Quote));
});

test('Tokenize double quote', ctx =>
{
  //Tokenize the text
  const result = lexer.tokenize('"');

  //Ensure the result is expected
  ctx.is(result.errors.length, 0);
  ctx.deepEqual(result.groups, {});
  ctx.is(result.tokens.length, 1);
  ctx.assert(tokenMatcher(result.tokens[0]!, Quote));
});

test('Tokenize literal string', ctx =>
{
  //Tokenize the text
  const result = lexer.tokenize('"much OR literally"');

  //Ensure the result is expected
  ctx.is(result.errors.length, 0);
  ctx.deepEqual(result.groups, {});
  ctx.is(result.tokens.length, 3);
  ctx.assert(tokenMatcher(result.tokens[0]!, Quote));
  ctx.assert(tokenMatcher(result.tokens[1]!, String));
  ctx.assert(tokenMatcher(result.tokens[2]!, Quote));
  ctx.is(result.tokens[1]!.image, 'much OR literally');
});

test('Tokenize non-literal string', ctx =>
{
  //Tokenize the text
  const result = lexer.tokenize('not so literally');

  //Ensure the result is expected
  ctx.is(result.errors.length, 0);
  ctx.deepEqual(result.groups, {});
  ctx.is(result.tokens.length, 1);
  ctx.assert(tokenMatcher(result.tokens[0]!, String));
  ctx.is(result.tokens[0]!.image, 'not so literally');
});