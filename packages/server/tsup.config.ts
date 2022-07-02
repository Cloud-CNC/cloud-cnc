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
  format: 'esm',
  minify: true,
  treeshake: true
});