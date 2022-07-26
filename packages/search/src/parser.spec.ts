/**
 * @fileoverview Chevrotain parser unit tests
 */

//Imports
import SearchParser from './parser';
import createLexer from './lexer';
import test from 'ava';

//Create the lexer and parser
const lexer = createLexer(true);
const parser = new SearchParser(true);

//Tests
test('Parse AND', ctx =>
{
  //Tokenize the text
  const lexerResult = lexer.tokenize('abc AND def');

  //Parse the tokens
  parser.input = lexerResult.tokens;
  const cst = parser.expression();

  //Ensure the result is expected
  ctx.snapshot(parser.errors);
  ctx.snapshot(cst);
});

test('Parse OR', ctx =>
{
  //Tokenize the text
  const lexerResult = lexer.tokenize('abc OR def');

  //Parse the tokens
  parser.input = lexerResult.tokens;
  const cst = parser.expression();

  //Ensure the result is expected
  ctx.snapshot(parser.errors);
  ctx.snapshot(cst);
});

test('Parse NOT', ctx =>
{
  //Tokenize the text
  const lexerResult = lexer.tokenize('NOT abc');

  //Parse the tokens
  parser.input = lexerResult.tokens;
  const cst = parser.expression();

  //Ensure the result is expected
  ctx.snapshot(parser.errors);
  ctx.snapshot(cst);
});

test('Parse parantheses', ctx =>
{
  //Tokenize the text
  const lexerResult = lexer.tokenize('(abc AND def) OR ghi');

  //Parse the tokens
  parser.input = lexerResult.tokens;
  const cst = parser.expression();

  //Ensure the result is expected
  ctx.snapshot(parser.errors);
  ctx.snapshot(cst);
});

test('Parse single quoted literal string', ctx =>
{
  //Tokenize the text
  const lexerResult = lexer.tokenize('\'much OR literally\'');

  //Parse the tokens
  parser.input = lexerResult.tokens;
  const cst = parser.expression();

  //Ensure the result is expected
  ctx.snapshot(parser.errors);
  ctx.snapshot(cst);
});

test('Parse double quoted literal string', ctx =>
{
  //Tokenize the text
  const lexerResult = lexer.tokenize('"much OR literally"');

  //Parse the tokens
  parser.input = lexerResult.tokens;
  const cst = parser.expression();

  //Ensure the result is expected
  ctx.snapshot(parser.errors);
  ctx.snapshot(cst);
});

test('Parse non-literal string', ctx =>
{
  //Tokenize the text
  const lexerResult = lexer.tokenize('not so literally');

  //Parse the tokens
  parser.input = lexerResult.tokens;
  const cst = parser.expression();

  //Ensure the result is expected
  ctx.snapshot(parser.errors);
  ctx.snapshot(cst);
});

test('Reject invalid input', ctx =>
{
  //Tokenize the text
  const lexerResult = lexer.tokenize('(');

  //Parse the tokens
  parser.input = lexerResult.tokens;
  const cst = parser.expression();

  //Ensure the result is expected
  ctx.snapshot(parser.errors);
  ctx.snapshot(cst);
});