/**
 * @fileoverview Generate TypeScript declaration for the parser
 * 
 * **NOTE: this file should be ran via `npm run generate:declaration`!**
 */

//Imports
import parser from '../src/parser';
import {generateCstDts} from 'chevrotain';
import {resolve} from 'path';
import {writeFile} from 'fs/promises';

const main = async () =>
{
  //Get the token productions
  const productions = parser.getGAstProductions();

  //Generate the TypeScript declaration
  const declaration = generateCstDts(productions);

  //Resolve the output path
  const output = resolve(__dirname, '..', 'src', 'cst.ts');

  //Write the declaration to the output path
  await writeFile(output, declaration);
};

main();