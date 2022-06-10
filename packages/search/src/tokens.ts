/**
 * @fileoverview Chevrotain tokens
 */

//Imports
import {Lexer, createToken} from 'chevrotain';

//Patterns
const WhitespacePattern = /\s+/;
const AndPattern = /AND/;
const OrPattern = /OR/;
const NotPattern = /NOT/;
const OpeningParanthesisPattern = /\(/;
const ClosingParanthesisPattern = /\)/;
const QuotePattern = /['"]/;

const ClosingStringPatterns = [
  AndPattern,
  OrPattern,
  NotPattern,
  OpeningParanthesisPattern,
  ClosingParanthesisPattern,
  QuotePattern
];
// eslint-disable-next-line security-node/non-literal-reg-expr
const ClosingStringPattern = new RegExp(`^(${ClosingStringPatterns.map(pattern => pattern.source).join('|')})`);

//Tokens
export const Whitespace = createToken({
  name: 'Whitespace',
  pattern: WhitespacePattern,
  group: Lexer.SKIPPED
});

export const DoubleOperandBooleanOperator = createToken({
  name: 'DoubleOperandBooleanOperator',
  pattern: Lexer.NA
});

export const And = createToken({
  name: 'And',
  pattern: AndPattern,
  categories: DoubleOperandBooleanOperator
});

export const Or = createToken({
  name: 'Or',
  pattern: OrPattern,
  categories: DoubleOperandBooleanOperator
});

export const Not = createToken({
  name: 'Not',
  pattern: NotPattern
});

export const OpeningParanthesis = createToken({
  name: 'OpeningParanthesis',
  pattern: OpeningParanthesisPattern
});

export const ClosingParanthesis = createToken({
  name: 'ClosingParanthesis',
  pattern: ClosingParanthesisPattern
});

export const Quote = createToken({
  name: 'Quote',
  pattern: QuotePattern,
});

export const String = createToken({
  name: 'String',
  pattern: {
    exec: (text, offset) =>
    {
      //Iterate over remaining characters
      let result = '';
      for (let i = offset; i < text.length; i++)
      {
        //Get the remaining text
        const remainingText = text.substring(i);

        //End of string
        if (ClosingStringPattern.test(remainingText))
        {
          //Strip trailing whitespace
          result = result.trimEnd();

          break;
        }
        //Start/middle of search
        else
        {
          result += text[i];
        }
      }
      
      return [result];
    }
  },
  line_breaks: true
});

//Aggregate tokens (Order matters!)
export const allTokens = [
  //Skip
  Whitespace,

  //Keywords
  DoubleOperandBooleanOperator,
  And,
  Or,
  Not,
  
  //Literals
  OpeningParanthesis,
  ClosingParanthesis,
  Quote,
  String
];