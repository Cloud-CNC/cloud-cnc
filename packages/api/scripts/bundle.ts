/**
 * @fileoverview YAML bundler script
 * 
 * **NOTE: this file should be ran via `npm run bundle`!**
 */

//Imports
import $RefParser from '@apidevtools/json-schema-ref-parser';
import {program} from 'commander';
import {stringify} from 'yaml';
import {version} from '../package.json';
import {writeFile} from 'fs/promises';

/**
 * Command lineoptions
 */
interface Options
{
  /**
   * Input file
   */
  input: string;

  /**
   * Output file
   */
  output: string;
}

//Create the root command
const command = program
  .name('server')
  .version(version)
  .description('YAML bundler')
  .option('-i, --input <file>', 'input file')
  .option('-o, --output <file>', 'output file')
  .action(async (options: Options) =>
  {
    //Bundle the input
    const schema = await $RefParser.bundle(options.input);

    //Stringify
    const str = stringify(schema);

    //Save the schema
    await writeFile(options.output, str);

    //Log
    console.log('Done!');
  });

//Process arguments and options
command.parse(process.argv);