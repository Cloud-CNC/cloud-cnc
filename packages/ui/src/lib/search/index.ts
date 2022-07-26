/**
 * @fileoverview Search highlights generator
 */

//Imports
import SearchParser from '~/search/parser';
import createLexer from '~/search/lexer';
import interpreter from './interpreter';
import {VNode, h} from 'vue';

//Create the lexer and parser
const lexer = createLexer(false);
const parser = new SearchParser(false);

/**
 * Search highlights
 * 
 * 1. Simplified text (eg: no redundant whitespace)
 * 2. Vue virtual DOM nodes
 */
export type Highlights = [string, VNode[]];

/**
 * Generate search highlights from the raw search
 * @param raw Raw search
 * @returns Search highlights, whether or not the input is **valid**
 */
export const generateHighlights = (raw: string): [...Highlights, boolean | string] =>
{
  //Compute the invalid highlights
  const invalid = [
    raw,
    [
      h('span', null, raw)
    ]
  ] as Highlights;

  //Tokenize the input
  const lexerResult = lexer.tokenize(raw);

  if (lexerResult.errors.length > 0)
  {
    //Generate the error message
    const message = lexerResult.errors.map(error => `${error.message} (Line ${error.line}, column ${error.column})`).join('\r\n');

    //Return the invalid highlights and the error message
    return [...invalid, message];
  }

  if (lexerResult.tokens.length == 0)
  {
    //Return the invalid highlights
    return [...invalid, true];
  }

  //Parse the tokens
  parser.input = lexerResult.tokens;
  const cst = parser.expression();

  if (parser.errors.length > 0)
  {
    //Generate the error message
    const message = parser.errors.map(error => `${error.message} (Line ${error.token.startLine}, column ${error.token.startColumn})`).join('\r\n');
    
    //Return the invalid highlights and the error message
    return [...invalid, message];
  }

  //Interpret the CST into highlights
  const highlights = interpreter.visit(cst) as Highlights;

  return [...highlights, true];
};