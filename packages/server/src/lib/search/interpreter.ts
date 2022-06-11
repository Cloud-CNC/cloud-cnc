/**
 * @fileoverview Chevrotain interpreter
 */

//Imports
import generateNgrams from './ngrams';
import parser from '@/search/parser';
import {And, Or} from '@/search/tokens';
import {AtomicExpressionCstChildren, DoubleOperandBooleanExpressionCstChildren, ExpressionCstChildren, FuzzySearchExpressionCstChildren, ICstNodeVisitor, LiteralSearchExpressionCstChildren, NotExpressionCstChildren, ParanthesisExpressionCstChildren} from '@/search/cst';
import {FilterQuery} from 'mongoose';
import {escapeRegExp} from 'lodash';
import {tokenMatcher} from 'chevrotain';

/**
 * Search query interpreter parameters
 */
interface SearchInterpreterParam
{
  /**
   * Fields to search against
   */
  fields: string[];
}

/**
 * Search query interpreter
 */
class SearchInterpreter extends parser.getBaseCstVisitorConstructor() implements ICstNodeVisitor<SearchInterpreterParam, FilterQuery<any>>
{
  constructor()
  {
    //Instantiate the parent
    super();

    //Detect missing or redundant methods
    this.validateVisitor();
  }

  expression(children: ExpressionCstChildren, param?: SearchInterpreterParam): FilterQuery<any>
  {
    if (children.doubleOperandBooleanExpression != null)
    {
      //Recurse
      return this.visit(children.doubleOperandBooleanExpression, param);
    }
    else if (children.notExpression != null)
    {
      //Recurse
      return this.visit(children.notExpression, param);
    }
    else
    {
      return {};
    }
  }

  doubleOperandBooleanExpression(children: DoubleOperandBooleanExpressionCstChildren, param?: SearchInterpreterParam): FilterQuery<any>
  {
    //Recurse the left-hand side
    let query = this.visit(children.lhs, param) as FilterQuery<any>;

    if (children.operator != null && children.rhs != null)
    {
      //Get the operator
      const operator = children.operator![0];

      //Recurse the right-hand side
      const rhsResult = this.visit(children.rhs, param);

      //And
      if (tokenMatcher(operator!, And))
      {
        query = {
          $and: [
            query,
            rhsResult
          ]
        };
      }
      //Or
      else if (tokenMatcher(operator!, Or))
      {
        query = {
          $or: [
            query,
            rhsResult
          ]
        };
      }
    }

    return query;
  }

  notExpression(children: NotExpressionCstChildren, param?: SearchInterpreterParam): FilterQuery<any>
  {
    //Recurse the expression
    const expressionResult = this.visit(children.expression, param);

    return {
      $nor: [
        expressionResult
      ]
    };
  }

  atomicExpression(children: AtomicExpressionCstChildren, param?: SearchInterpreterParam): FilterQuery<any>
  {
    if (children.fuzzySearchExpression != null)
    {
      //Recurse
      return this.visit(children.fuzzySearchExpression, param);
    }
    else if (children.literalSearchExpression != null)
    {
      //Recurse
      return this.visit(children.literalSearchExpression, param);
    }
    else if (children.paranthesisExpression != null)
    {
      //Recurse
      return this.visit(children.paranthesisExpression, param);
    }
    else
    {
      return {};
    }
  }

  paranthesisExpression(children: ParanthesisExpressionCstChildren, param?: SearchInterpreterParam): FilterQuery<any>
  {
    //Recurse
    return this.visit(children.expression, param);
  }

  fuzzySearchExpression(children: FuzzySearchExpressionCstChildren, param: SearchInterpreterParam): FilterQuery<any>
  {
    //Get the raw query
    const raw = children.string[0]!.image;

    //Generate n-grams
    const ngrams = generateNgrams(raw, Math.min(raw.length, 3), 10, 250);

    /**
     * N-gram query factory
     * @param field Field name
     * @returns Mongoose query
     */
    const ngramQueryFactory = (field: string) =>
    ({
      $or: ngrams.map(ngram => ({
        // eslint-disable-next-line security-node/non-literal-reg-expr
        [field]: new RegExp(escapeRegExp(ngram))
      }))
    } as FilterQuery<any>);

    if (param.fields.length == 1)
    {
      return ngramQueryFactory(param.fields[0]!);
    }
    else
    {
      return {
        $or: param.fields.map(field => ngramQueryFactory(field))
      };
    }
  }

  literalSearchExpression(children: LiteralSearchExpressionCstChildren, param: SearchInterpreterParam): FilterQuery<any>
  {
    //Get the raw query
    const raw = children.string[0]!.image;

    //Escape the query
    // eslint-disable-next-line security-node/non-literal-reg-expr
    const regex = new RegExp(escapeRegExp(raw));

    if (param.fields.length == 1)
    {
      return {
        [param.fields[0]!]: regex
      };
    }
    else
    {
      return {
        $or: param.fields.map(field => ({
          [field]: regex
        }))
      };
    }
  }
}

//Create the interpreter
const interpreter = new SearchInterpreter();

//Export
export default interpreter;