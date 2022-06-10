/**
 * @fileoverview Chevrotain parser
 */

//Imports
import {CstParser} from 'chevrotain';
import {allTokens, ClosingParanthesis, DoubleOperandBooleanOperator, Not, OpeningParanthesis, Quote, String} from './tokens';

/**
 * Search query parser
 */
class SearchParser extends CstParser
{
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
      this.CONSUME(DoubleOperandBooleanOperator, {
        LABEL: 'operator'
      });
      this.SUBRULE2(this.expression, {
        LABEL: 'rhs'
      });
    });
  });

  private notExpression = this.RULE('notExpression', () =>
  {
    this.CONSUME(Not);
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
    this.CONSUME(OpeningParanthesis);
    this.SUBRULE(this.expression);
    this.CONSUME(ClosingParanthesis);
  });

  private fuzzySearchExpression = this.RULE('fuzzySearchExpression', () =>
  {
    this.CONSUME(String, {
      LABEL: 'string'
    });
  });

  private literalSearchExpression = this.RULE('literalSearchExpression', () =>
  {
    this.CONSUME1(Quote);
    this.CONSUME2(String, {
      LABEL: 'string'
    });
    this.CONSUME3(Quote);
  });
}

//Create the parser
const parser = new SearchParser();

//Export
export default parser;