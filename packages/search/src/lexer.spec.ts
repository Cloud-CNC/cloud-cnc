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

test('Tokenize single quote', ctx =>
{
  //Tokenize the text
  const result = lexer.tokenize('\'');

  //Ensure the result is expected
  ctx.snapshot(result);
});

test('Tokenize double quote', ctx =>
{
  //Tokenize the text
  const result = lexer.tokenize('"');

  //Ensure the result is expected
  ctx.snapshot(result);
});

test('Tokenize literal string', ctx =>
{
  //Tokenize the text
  const result = lexer.tokenize('"much OR literally"');

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