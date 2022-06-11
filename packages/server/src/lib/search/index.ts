/**
 * @fileoverview Search query generator
 */

//Imports
import {FilterQuery} from 'mongoose';
import parser from '@/search/parser';
import lexer from '@/search/lexer';
import interpreter from './interpreter';

/**
 * Generate a Mongoose query from the raw search against the specified field names
 * @param raw Raw search
 * @param fields Fields to search against
 * @returns Mongoose query
 */
const generateQuery = <T>(raw: string, fields: (keyof T)[]): FilterQuery<T> =>
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
    const message = parser.errors.map(error => `${error.message} (Line ${error.token.startLine}, column ${error.token.startColumn})`).join('\r\n');
    
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