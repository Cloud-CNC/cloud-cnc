/**
 * @fileoverview Search query generator
 */

//Imports
import SearchParser from '~/search/parser';
import createLexer from '~/search/lexer';
import interpreter from './interpreter';
import mongoose from 'mongoose';

//Create the lexer and parser
const lexer = createLexer(true);
const parser = new SearchParser(true);

/**
 * Generate a Mongoose query from the raw search against the specified field names
 * @param raw Raw search
 * @param fields Fields to search against
 * @returns Mongoose query
 */
const generateQuery = <T>(raw: string, fields: (keyof T)[]): mongoose.FilterQuery<T> =>
{
  //Tokenize the input
  const lexerResult = lexer.tokenize(raw);

  if (lexerResult.errors.length > 0)
  {
    //Generate the error message
    const message = lexerResult.errors.map(error => `${error.message} (Line ${error.line}, column ${error.column})`).join('\r\n');

    throw new Error(message);
  }

  //Parse the tokens
  parser.input = lexerResult.tokens;
  const cst = parser.expression();

  if (parser.errors.length > 0)
  {
    //Generate the error message
    const message = parser.errors.map(error => `${error.name}: ${error.message} (Line ${error.token.startLine}, column ${error.token.startColumn})`).join('\r\n');

    throw new Error(message);
  }

  //Interpret the CST into a query
  const query = interpreter.visit(cst, {
    fields
  });

  return query;
};

//Export
export default generateQuery;