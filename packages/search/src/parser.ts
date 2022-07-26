/**
 * @fileoverview Chevrotain parser
 */

//Imports
import {ClosingParanthesis, DoubleOperandBooleanOperator, Not, OpeningParanthesis, Quote, String, getAllTokens, NonSkippedWhitespace} from './tokens';
import {CstParser} from 'chevrotain';

/**
 * Search query parser
 */
class SearchParser extends CstParser
{
  /**
   * Whether or not to skip whitespace
   */
  private skipWhitespace: boolean;

  /**
   * Consumes a whitespace if appropriate
   * @param index Consume index
   * @param label Whitespace label
   */
  private consumeWhitespace(index = 0, label?: string)
  {
    //Consume the whitespace
    if (!this.skipWhitespace)
    {
      this.consume(index, NonSkippedWhitespace, {
        LABEL: label
      });
    }
  }

  /**
   * Search query parser constructor
   * @param skipWhitespace Whether or not to skip whitespace
   * @returns Parser
   */
  constructor(skipWhitespace: boolean)
  {
    //Get all tokens
    const allTokens = getAllTokens(skipWhitespace);

    //Instantiate the parent
    super(allTokens);

    //Store state
    this.skipWhitespace = skipWhitespace;

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
      this.consumeWhitespace(1, 'beforeOperator');
      this.CONSUME(DoubleOperandBooleanOperator, {
        LABEL: 'operator'
      });
      this.consumeWhitespace(2, 'afterOperator');
      this.SUBRULE(this.expression, {
        LABEL: 'rhs'
      });
    });
  });

  private notExpression = this.RULE('notExpression', () =>
  {
    this.CONSUME(Not, {
      LABEL: 'not'
    });
    this.consumeWhitespace(0, 'whitespace');
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
        ALT: () => this.SUBRULE(this.paranthesisExpression)
      },
      {
        ALT: () => this.SUBRULE(this.fuzzySearchExpression)
      },
      {
        ALT: () => this.SUBRULE(this.literalSearchExpression)
      }
    ]);
  });

  private paranthesisExpression = this.RULE('paranthesisExpression', () =>
  {
    this.CONSUME(OpeningParanthesis, {
      LABEL: 'openingParanthesis'
    });
    this.SUBRULE(this.expression);
    this.CONSUME(ClosingParanthesis, {
      LABEL: 'closingParanthesis'
    });
  });

  private fuzzySearchExpression = this.RULE('fuzzySearchExpression', () =>
  {
    this.CONSUME(String, {
      LABEL: 'string'
    });
  });

  private literalSearchExpression = this.RULE('literalSearchExpression', () =>
  {
    this.CONSUME1(Quote, {
      LABEL: 'openingQuote'
    });
    this.CONSUME2(String, {
      LABEL: 'string'
    });
    this.CONSUME3(Quote, {
      LABEL: 'closingQuote'
    });
  });
}

//Export
export default SearchParser;