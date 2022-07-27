import type {CstNode, ICstVisitor, IToken} from 'chevrotain';

export interface ExpressionCstNode extends CstNode
{
  name: 'expression';
  children: ExpressionCstChildren;
}

export type ExpressionCstChildren = {
  doubleOperandBooleanExpression?: DoubleOperandBooleanExpressionCstNode[];
  notExpression?: NotExpressionCstNode[];
};

export interface DoubleOperandBooleanExpressionCstNode extends CstNode
{
  name: 'doubleOperandBooleanExpression';
  children: DoubleOperandBooleanExpressionCstChildren;
}

export type DoubleOperandBooleanExpressionCstChildren = {
  lhs: AtomicExpressionCstNode[];
  beforeOperator?: IToken[];
  operator?: IToken[];
  afterOperator?: IToken[];
  rhs?: ExpressionCstNode[];
};

export interface NotExpressionCstNode extends CstNode
{
  name: 'notExpression';
  children: NotExpressionCstChildren;
}

export type NotExpressionCstChildren = {
  not: IToken[];
  whitespace: IToken[];
  expression: ExpressionCstNode[];
};

export interface AtomicExpressionCstNode extends CstNode
{
  name: 'atomicExpression';
  children: AtomicExpressionCstChildren;
}

export type AtomicExpressionCstChildren = {
  parenthesisExpression?: ParenthesisExpressionCstNode[];
  fuzzySearchExpression?: FuzzySearchExpressionCstNode[];
  literalSearchExpression?: LiteralSearchExpressionCstNode[];
};

export interface ParenthesisExpressionCstNode extends CstNode
{
  name: 'parenthesisExpression';
  children: ParenthesisExpressionCstChildren;
}

export type ParenthesisExpressionCstChildren = {
  openingParenthesis: IToken[];
  expression: ExpressionCstNode[];
  closingParenthesis: IToken[];
};

export interface FuzzySearchExpressionCstNode extends CstNode
{
  name: 'fuzzySearchExpression';
  children: FuzzySearchExpressionCstChildren;
}

export type FuzzySearchExpressionCstChildren = {
  fuzzyString: IToken[];
};

export interface LiteralSearchExpressionCstNode extends CstNode
{
  name: 'literalSearchExpression';
  children: LiteralSearchExpressionCstChildren;
}

export type LiteralSearchExpressionCstChildren = {
  literalString: IToken[];
};

export interface ICstNodeVisitor<IN, OUT> extends ICstVisitor<IN, OUT>
{
  expression(children: ExpressionCstChildren, param?: IN): OUT;
  doubleOperandBooleanExpression(children: DoubleOperandBooleanExpressionCstChildren, param?: IN): OUT;
  notExpression(children: NotExpressionCstChildren, param?: IN): OUT;
  atomicExpression(children: AtomicExpressionCstChildren, param?: IN): OUT;
  parenthesisExpression(children: ParenthesisExpressionCstChildren, param?: IN): OUT;
  fuzzySearchExpression(children: FuzzySearchExpressionCstChildren, param?: IN): OUT;
  literalSearchExpression(children: LiteralSearchExpressionCstChildren, param?: IN): OUT;
}
