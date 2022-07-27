/**
 * @fileoverview Chevrotain parser
 */

//Imports
import {allTokens, closingParenthesis, doubleOperandBooleanOperator, fuzzyString, literalString, not, openingParenthesis, whitespace} from './tokens';
import {CstParser} from 'chevrotain';

/**
 * Search query parser
 */
class SearchParser extends CstParser
{
  /**
   * Search query parser constructor
   * @returns Parser
   */
  constructor()
  {
    //Instantiate the parent
    super(allTokens);

    //Check the grammar
    this.performSelfAnalysis();
  }

  public expression = this.RULE('expression', () =>
  {
    this.OR([
      {
        ALT: () => this.SUBRULE(this.doubleOperandBooleanExpression)
      },
      {
        ALT: () => this.SUBRULE(this.notExpression)
      }
    ]);
  });

  private doubleOperandBooleanExpression = this.RULE('doubleOperandBooleanExpression', () =>
  {
    this.SUBRULE(this.atomicExpression, {
      LABEL: 'lhs'
    });
    this.MANY(() =>
    {
      this.CONSUME1(whitespace, {
        LABEL: 'beforeOperator'
      });
      this.CONSUME(doubleOperandBooleanOperator, {
        LABEL: 'operator'
      });
      this.CONSUME2(whitespace, {
        LABEL: 'afterOperator'
      });
      this.SUBRULE(this.expression, {
        LABEL: 'rhs'
      });
    });
  });

  private notExpression = this.RULE('notExpression', () =>
  {
    this.CONSUME(not, {
      LABEL: 'not'
    });
    this.CONSUME(whitespace, {
      LABEL: 'whitespace'
    });
    this.AT_LEAST_ONE(() =>
    {
      this.SUBRULE(this.expression, {
        LABEL: 'expression'
      });
    });
  });

  private atomicExpression = this.RULE('atomicExpression', () =>
  {
    this.OR([
      {
        ALT: () => this.SUBRULE(this.parenthesisExpression)
      },
      {
        ALT: () => this.SUBRULE(this.fuzzySearchExpression)
      },
      {
        ALT: () => this.SUBRULE(this.literalSearchExpression)
      }
    ]);
  });

  private parenthesisExpression = this.RULE('parenthesisExpression', () =>
  {
    this.CONSUME(openingParenthesis, {
      LABEL: 'openingParenthesis'
    });
    this.SUBRULE(this.expression);
    this.CONSUME(closingParenthesis, {
      LABEL: 'closingParenthesis'
    });
  });

  private fuzzySearchExpression = this.RULE('fuzzySearchExpression', () =>
  {
    this.CONSUME(fuzzyString, {
      LABEL: 'fuzzyString'
    });
  });

  private literalSearchExpression = this.RULE('literalSearchExpression', () =>
  {
    this.CONSUME(literalString, {
      LABEL: 'literalString'
    });
  });
}

//Instantiate the parser
const parser = new SearchParser();

//Export
export default parser;