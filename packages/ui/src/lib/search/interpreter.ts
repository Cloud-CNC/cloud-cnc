/**
 * @fileoverview Chevrotain interpreter
 */

//Imports
import parser from '~/search/parser';
import {AtomicExpressionCstChildren, DoubleOperandBooleanExpressionCstChildren, ExpressionCstChildren, FuzzySearchExpressionCstChildren, ICstNodeVisitor, LiteralSearchExpressionCstChildren, NotExpressionCstChildren, ParenthesisExpressionCstChildren} from '~/search/cst';
import {Highlights} from './index';
import {and, or} from '~/search/tokens';
import {h} from 'vue';
import {tokenMatcher} from 'chevrotain';

/**
 * Search query interpreter
 */
class SearchInterpreter extends parser.getBaseCstVisitorConstructor() implements ICstNodeVisitor<undefined, Highlights>
{
  constructor()
  {
    //Instantiate the parent
    super();

    //Detect missing or redundant methods
    this.validateVisitor();
  }

  expression(children: ExpressionCstChildren): Highlights
  {
    if (children.doubleOperandBooleanExpression != null)
    {
      //Recurse
      return this.visit(children.doubleOperandBooleanExpression);
    }
    else if (children.notExpression != null)
    {
      //Recurse
      return this.visit(children.notExpression);
    }
    else
    {
      return [
        '',
        [
          h('span')
        ]
      ];
    }
  }

  doubleOperandBooleanExpression(children: DoubleOperandBooleanExpressionCstChildren): Highlights
  {
    //Recurse the left-hand side
    let result = this.visit(children.lhs) as Highlights;

    if (children.operator != null && children.rhs != null)
    {
      //Get the operator
      const operator = children.operator![0]!;

      //Recurse the right-hand side
      const rhsResult = this.visit(children.rhs) as Highlights;

      //Get the text
      const text = `${children.beforeOperator?.map(child => child.image).join('')}${operator?.image}${children.afterOperator?.map(child => child.image).join('')}`;

      //Supported operation
      if (tokenMatcher(operator!, and) || tokenMatcher(operator!, or))
      {
        //Update the result
        result = [
          `${result[0]}${text}${rhsResult[0]}`,
          [
            ...result[1],
            h('span', {
              class: 'keyword'
            }, text),
            ...rhsResult[1]
          ]
        ];
      }
    }

    return result;
  }

  notExpression(children: NotExpressionCstChildren): Highlights
  {
    //Recurse the expression
    const result = this.visit(children.expression) as Highlights;

    //Get the text
    const text = `${children.not[0]!.image}${children.whitespace.map(child => child.image).join('')}`;

    return [
      `${text}${result[0]}`,
      [
        h('span', {
          class: 'keyword'
        }, text),
        ...result[1]
      ]
    ];
  }

  atomicExpression(children: AtomicExpressionCstChildren): Highlights
  {
    if (children.fuzzySearchExpression != null)
    {
      //Recurse
      return this.visit(children.fuzzySearchExpression);
    }
    else if (children.literalSearchExpression != null)
    {
      //Recurse
      return this.visit(children.literalSearchExpression);
    }
    else if (children.parenthesisExpression != null)
    {
      //Recurse
      return this.visit(children.parenthesisExpression);
    }
    else
    {
      return [
        '',
        [
          h('span')
        ]
      ];
    }
  }

  parenthesisExpression(children: ParenthesisExpressionCstChildren): Highlights
  {
    //Recurse the expression
    const result = this.visit(children.expression) as Highlights;

    return [
      `${children.openingParenthesis[0]!.image}${result[0]}${children.closingParenthesis[0]!.image}`,
      [
        h('span', {
          class: 'character'
        }, children.openingParenthesis[0]!.image),
        ...result[1],
        h('span', {
          class: 'character'
        }, children.closingParenthesis[0]!.image)
      ]
    ];
  }

  fuzzySearchExpression(children: FuzzySearchExpressionCstChildren): Highlights
  {
    //Get the text
    const text = children.fuzzyString[0]!.image;

    return [
      text,
      [
        h('span', {
          class: 'fuzzy'
        }, text)
      ]
    ];
  }

  literalSearchExpression(children: LiteralSearchExpressionCstChildren): Highlights
  {
    //Get the text
    const text = children.literalString[0]!.image;

    return [
      text,
      [
        h('span', {
          class: 'literal'
        }, text)
      ]
    ];
  }
}

//Create the interpreter
const interpreter = new SearchInterpreter();

//Export
export default interpreter;