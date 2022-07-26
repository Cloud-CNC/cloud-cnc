/**
 * @fileoverview Chevrotain lexer unit tests
 */

//Imports
import createLexer from './lexer';
import test from 'ava';

//Create the lexer
const lexer = createLexer(true);

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

test('Tokenize opening paranthesis', ctx =>
{
  //Tokenize the text
  const result = lexer.tokenize('(');

  //Ensure the result is expected
  ctx.snapshot(result);
});

test('Tokenize closing paranthesis', ctx =>
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

test('Tokenize non-literal string', ctx =>
{
  //Tokenize the text
  const result = lexer.tokenize('not so literally');

  //Ensure the result is expected
  ctx.snapshot(result);
});