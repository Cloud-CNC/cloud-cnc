/**
 * @fileoverview Chevrotain lexer
 */

//Imports
import {Lexer} from 'chevrotain';
import {allTokens} from './tokens';

//Create the lexer
const lexer = new Lexer(allTokens);

//Export
export default lexer;