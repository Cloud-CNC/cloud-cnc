# Human-Centric Search Language
This package contains the [Chevrotain](https://chevrotain.io)-powered lexer and parser for Cloud
CNC's human-centric search language.

## Features
* Ngram-based fuzzy-searching by default
* Boolean operators: `AND`, `OR`, and `NOT` (Inspired by SQL)
* Literal matching: `"literal query"` or `'literal query'` (Inspired by Google-search)
* Paranthesis prioritization: `(a AND b) OR c` (Inspired by mathematical order-of-operations)

## Development

### Chevrotain interpreters
Since this package is used by the UI and API server for quite different purposes (query highlighting
and Mongoose query generation, respectively), the [concrete-syntax-tree interpreter/visitor](https://chevrotain.io/docs/guide/concrete_syntax_tree.html#cst-visitor)
is not included in this package.