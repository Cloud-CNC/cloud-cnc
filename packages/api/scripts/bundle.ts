/**
 * @fileoverview YAML bundler script
 * 
 * **NOTE: this file should be ran via `npm run bundle`!**
 */

//Imports
import $RefParser from '@apidevtools/json-schema-ref-parser';
import {program} from 'commander';
import {readPackageUpSync} from 'read-pkg-up';
import {stringify} from 'yaml';
import {writeFile} from 'fs/promises';

/**
 * Command line options
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

//Read the package
const pkg = readPackageUpSync();

if (pkg == null)
{
  throw new Error('Failed to read nearest package.json!');
}

//Create the root command
const command = program
  .name('server')
  .version(pkg.packageJson.version)
  .description('YAML bundler')
  .requiredOption('-i, --input <file>', 'input file')
  .requiredOption('-o, --output <file>', 'output file')
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