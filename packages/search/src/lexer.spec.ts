/**
 * @fileoverview Chevrotain lexer unit tests
 */

//Imports
import lexer from './lexer';
import test from 'ava';

//Tests
test('Tokenize AND', ctx =>
{
  //Tokenize the text
  const result = lexer.tokenize('AND');

  //Ensure the result is expected
  ctx.snapshot(result);
});

test('Tokenize OR', ctx =>
{
  //Tokenize the text
  const result = lexer.tokenize('OR');

  //Ensure the result is expected
  ctx.snapshot(result);
});

test('Tokenize NOT', ctx =>
{
  //Tokenize the text
  const result = lexer.tokenize('NOT');

  //Ensure the result is expected
  ctx.snapshot(result);
});

test('Tokenize opening parenthesis', ctx =>
{
  //Tokenize the text
  const result = lexer.tokenize('(');

  //Ensure the result is expected
  ctx.snapshot(result);
});

test('Tokenize closing parenthesis', ctx =>
{
  //Tokenize the text
  const result = lexer.tokenize(')');

  //Ensure the result is expected
  ctx.snapshot(result);
});

test('Tokenize single-quoted literal string', ctx =>
{
  //Tokenize the text
  const result = lexer.tokenize('\'much\'');

  //Ensure the result is expected
  ctx.snapshot(result);
});

test('Tokenize single-quoted literal string containing a double-quote', ctx =>
{
  //Tokenize the text
  const result = lexer.tokenize('\'mu"ch\'');

  //Ensure the result is expected
  ctx.snapshot(result);
});

test('Tokenize double-quoted literal string', ctx =>
{
  //Tokenize the text
  const result = lexer.tokenize('"much"');

  //Ensure the result is expected
  ctx.snapshot(result);
});

test('Tokenize double-quoted literal string containing a single-quote', ctx =>
{
  //Tokenize the text
  const result = lexer.tokenize('"mu\'ch"');

  //Ensure the result is expected
  ctx.snapshot(result);
});

test('Tokenize literal string containing only a keyword', ctx =>
{
  //Tokenize the text
  const result = lexer.tokenize('"OR"');

  //Ensure the result is expected
  ctx.snapshot(result);
});

test('Tokenize fuzzy string', ctx =>
{
  //Tokenize the text
  const result = lexer.tokenize('not so literally');

  //Ensure the result is expected
  ctx.snapshot(result);
});