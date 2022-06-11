/**
 * @fileoverview TSUP Config
 */

//Imports
import {defineConfig} from 'tsup';

//Export
export default defineConfig({
  entry: [
    'src/index.ts'
  ],
  minify: true,
  treeshake: true
});