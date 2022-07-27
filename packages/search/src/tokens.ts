/**
 * @fileoverview Chevrotain tokens
 */

//Imports
import {Lexer, createToken} from 'chevrotain';

//Patterns
const whitespacePattern = /\s+/;
const andPattern = /AND/;
const orPattern = /OR/;
const notPattern = /NOT/;
const openingParenthesisPattern = /\(/;
const closingParenthesisPattern = /\)/;
const literalStringPattern = /(['"])(?:.+?\1)/;

const fuzzyStringClosingPatterns = [
  andPattern,
  orPattern,
  notPattern,
  openingParenthesisPattern,
  closingParenthesisPattern,
  literalStringPattern
];

// eslint-disable-next-line security-node/non-literal-reg-expr
const fuzzyStringClosingPattern = new RegExp(`^(?:${fuzzyStringClosingPatterns.map(pattern => pattern.source).join('|')})`);

//Tokens
export const whitespace = createToken({
  name: '[whitespace]',
  pattern: whitespacePattern,
});

export const doubleOperandBooleanOperator = createToken({
  name: '[double operand boolean operator]',
  pattern: Lexer.NA
});

export const and = createToken({
  name: 'AND',
  pattern: andPattern,
  categories: doubleOperandBooleanOperator
});

export const or = createToken({
  name: 'OR',
  pattern: orPattern,
  categories: doubleOperandBooleanOperator
});

export const not = createToken({
  name: 'NOT',
  pattern: notPattern
});

export const openingParenthesis = createToken({
  name: '(',
  pattern: openingParenthesisPattern
});

export const closingParenthesis = createToken({
  name: ')',
  pattern: closingParenthesisPattern
});

export const literalString = createToken({
  name: '[literal string]',
  pattern: literalStringPattern
});

export const fuzzyString = createToken({
  name: '[fuzzy string]',
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
        if (fuzzyStringClosingPattern.test(remainingText))
        {
          // debugger;

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
  // eslint-disable-next-line camelcase
  line_breaks: true
});

//All tokens (Order matters)
export const allTokens = [
  //Whitespace
  whitespace,

  //Keywords
  doubleOperandBooleanOperator,
  and,
  or,
  not,

  //Literals
  openingParenthesis,
  closingParenthesis,
  literalString,
  fuzzyString
];