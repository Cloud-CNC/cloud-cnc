/**
 * @fileoverview TypeScript declaration generator script
 * 
 * **NOTE: this file should be ran via `npm run generate:declaration`!**
 */

//Imports
import SearchParser from '~/search/parser';
import {dirname, resolve} from 'path';
import {fileURLToPath} from 'url';
import {generateCstDts} from 'chevrotain';
import {writeFile} from 'fs/promises';

const main = async () =>
{
  //Get the token productions
  const productions = new SearchParser(false).getGAstProductions();

  //Generate the TypeScript declaration
  const declaration = generateCstDts(productions);

  //Get the directory name
  const dir = dirname(fileURLToPath(import.meta.url));

  //Resolve the output path
  const output = resolve(dir, '..', 'src', 'cst.ts');

  //Write the declaration to the output path
  await writeFile(output, declaration);
};

main();