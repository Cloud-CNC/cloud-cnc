# Search language
Cloud CNC uses a custom-made <SourceLink path="packages/search">Human-Centric Search Language</SourceLink>
to augment natural language searches.

## Features
* Ngram-based fuzzy-searching by default
* Literal searching: `"literal query"` (Inspired by Google-search)
* Boolean operators: `AND`, `OR`, and `NOT` (Inspired by SQL)
* Parentheses-based order-of-operations: `(a AND b) OR c` (Inspired by algebra)

## Examples
1. `John Doe`: fuzzy-search for `John Doe`
2. `"John Doe"`: literal-search for `John Doe` (**Note: capitalization must match!**)
3. `(John OR Jane) AND Doe`: fuzzy-search for `John Doe` and `Jane Doe`
4. `Doe AND NOT John`: fuzzy-search for `Doe`, excluding `John` (Fuzzy-matched)
5. `Doe AND NOT "John"`: fuzzy-search for `Doe`, excluding `John` (Literal-matched)
6. `(Jane OR John OR Reily) AND NOT ((Jane AND Doe) OR (John AND Appleseed) OR (Reily AND Doe))`: fuzzy-search for `Jane`, excluding `Doe` (Fuzzy-matched) or fuzzy-search for `John`, excluding `Appleseed` (Fuzzy-matched), or fuzzy-search for `Reily`, excluding `Doe` (Fuzzy-matched)