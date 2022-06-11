/**
 * @fileoverview Chevrotain parser unit tests
 * 
 * Tip: use a JSON path finder like https://site24x7.com/tools/jsonpath-finder-validator.html
 */

//Imports
import lexer from './lexer';
import parser from './parser';
import test from 'ava';
import {get} from 'lodash';

//Tests
test('Parse AND', ctx =>
{
  //Tokenize the text
  const lexerResult = lexer.tokenize('abc AND def');

  //Parse the tokens
  parser.input = lexerResult.tokens;
  const cst = parser.expression();

  //Ensure the result is expected
  ctx.is(parser.errors.length, 0);
  ctx.is(cst.name, 'expression');
  ctx.is(get(cst, 'children.doubleOperandBooleanExpression[0].children.lhs[0].children.fuzzySearchExpression[0].children.string[0].image'), 'abc');
  ctx.is(get(cst, 'children.doubleOperandBooleanExpression[0].children.operator[0].tokenType.name'), 'And');
  ctx.is(get(cst, 'children.doubleOperandBooleanExpression[0].children.rhs[0].children.doubleOperandBooleanExpression[0].children.lhs[0].children.fuzzySearchExpression[0].children.string[0].image'), 'def');
});

test('Parse OR', ctx =>
{
  //Tokenize the text
  const lexerResult = lexer.tokenize('abc OR def');

  //Parse the tokens
  parser.input = lexerResult.tokens;
  const cst = parser.expression();

  //Ensure the result is expected
  ctx.is(parser.errors.length, 0);
  ctx.is(cst.name, 'expression');
  ctx.is(get(cst, 'children.doubleOperandBooleanExpression[0].children.lhs[0].children.fuzzySearchExpression[0].children.string[0].image'), 'abc');
  ctx.is(get(cst, 'children.doubleOperandBooleanExpression[0].children.operator[0].tokenType.name'), 'Or');
  ctx.is(get(cst, 'children.doubleOperandBooleanExpression[0].children.rhs[0].children.doubleOperandBooleanExpression[0].children.lhs[0].children.fuzzySearchExpression[0].children.string[0].image'), 'def');
});

test('Parse NOT', ctx =>
{
  //Tokenize the text
  const lexerResult = lexer.tokenize('NOT abc');

  //Parse the tokens
  parser.input = lexerResult.tokens;
  const cst = parser.expression();

  //Ensure the result is expected
  ctx.is(parser.errors.length, 0);
  ctx.is(cst.name, 'expression');
  ctx.is(get(cst, 'children.notExpression[0].children.Not[0].tokenType.name'), 'Not');
  ctx.is(get(cst, 'children.notExpression[0].children.expression[0].children.doubleOperandBooleanExpression[0].children.lhs[0].children.fuzzySearchExpression[0].children.string[0].image'), 'abc');
});

test('Parse parantheses', ctx =>
{
  //Tokenize the text
  const lexerResult = lexer.tokenize('(abc AND def) OR ghi');

  //Parse the tokens
  parser.input = lexerResult.tokens;
  const cst = parser.expression();

  //Ensure the result is expected
  ctx.is(parser.errors.length, 0);
  ctx.is(cst.name, 'expression');
  ctx.is(get(cst, 'children.doubleOperandBooleanExpression[0].children.lhs[0].children.paranthesisExpression[0].name'), 'paranthesisExpression');
  ctx.is(get(cst, 'children.doubleOperandBooleanExpression[0].children.lhs[0].children.paranthesisExpression[0].children.expression[0].children.doubleOperandBooleanExpression[0].children.lhs[0].children.fuzzySearchExpression[0].children.string[0].image'), 'abc');
  ctx.is(get(cst, 'children.doubleOperandBooleanExpression[0].children.lhs[0].children.paranthesisExpression[0].children.expression[0].children.doubleOperandBooleanExpression[0].children.operator[0].tokenType.name'), 'And');
  ctx.is(get(cst, 'children.doubleOperandBooleanExpression[0].children.lhs[0].children.paranthesisExpression[0].children.expression[0].children.doubleOperandBooleanExpression[0].children.rhs[0].children.doubleOperandBooleanExpression[0].children.lhs[0].children.fuzzySearchExpression[0].children.string[0].image'), 'def');
  ctx.is(get(cst, 'children.doubleOperandBooleanExpression[0].children.operator[0].tokenType.name'), 'Or');
  ctx.is(get(cst, 'children.doubleOperandBooleanExpression[0].children.rhs[0].children.doubleOperandBooleanExpression[0].children.lhs[0].children.fuzzySearchExpression[0].children.string[0].image'), 'ghi');
});

test('Parse single quoted literal string', ctx =>
{
  //Tokenize the text
  const lexerResult = lexer.tokenize('\'much OR literally\'');

  //Parse the tokens
  parser.input = lexerResult.tokens;
  const cst = parser.expression();

  //Ensure the result is expected
  ctx.is(parser.errors.length, 0);
  ctx.is(cst.name, 'expression');
  ctx.is(get(cst, 'children.doubleOperandBooleanExpression[0].children.lhs[0].children.literalSearchExpression[0].name'), 'literalSearchExpression');
  ctx.is(get(cst, 'children.doubleOperandBooleanExpression[0].children.lhs[0].children.literalSearchExpression[0].children.string[0].image'), 'much OR literally');
});

test('Parse double quoted literal string', ctx =>
{
  //Tokenize the text
  const lexerResult = lexer.tokenize('"much OR literally"');

  //Parse the tokens
  parser.input = lexerResult.tokens;
  const cst = parser.expression();

  //Ensure the result is expected
  ctx.is(parser.errors.length, 0);
  ctx.is(cst.name, 'expression');
  ctx.is(get(cst, 'children.doubleOperandBooleanExpression[0].children.lhs[0].children.literalSearchExpression[0].name'), 'literalSearchExpression');
  ctx.is(get(cst, 'children.doubleOperandBooleanExpression[0].children.lhs[0].children.literalSearchExpression[0].children.string[0].image'), 'much OR literally');
});

test('Parse non-literal string', ctx =>
{
  //Tokenize the text
  const lexerResult = lexer.tokenize('not so literally');

  //Parse the tokens
  parser.input = lexerResult.tokens;
  const cst = parser.expression();

  //Ensure the result is expected
  ctx.is(parser.errors.length, 0);
  ctx.is(cst.name, 'expression');
  ctx.is(get(cst, 'children.doubleOperandBooleanExpression[0].children.lhs[0].children.fuzzySearchExpression[0].name'), 'fuzzySearchExpression');
  ctx.is(get(cst, 'children.doubleOperandBooleanExpression[0].children.lhs[0].children.fuzzySearchExpression[0].children.string[0].image'), 'not so literally');
});

test('Reject invalid input', ctx =>
{
  //Tokenize the text
  const lexerResult = lexer.tokenize('(');

  //Parse the tokens
  parser.input = lexerResult.tokens;
  const cst = parser.expression();

  //Ensure the result is expected
  ctx.is(parser.errors.length, 1);
  ctx.is(parser.errors[0]!.name, 'NoViableAltException');
  ctx.deepEqual(cst, undefined);
});