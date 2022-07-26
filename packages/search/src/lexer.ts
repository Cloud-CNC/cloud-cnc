/**
 * @fileoverview Chevrotain lexer
 */

//Imports
import {Lexer} from 'chevrotain';
import {getAllTokens} from './tokens';

/**
 * Create the lexer
 * @param skipWhitespace Whether or not to skip whitespace
 * @returns Lexer
 */
const createLexer = (skipWhitespace: boolean) =>
{
  //Get all tokens
  const allTokens = getAllTokens(skipWhitespace);

  return new Lexer(allTokens);
};

//Export
export default createLexer;