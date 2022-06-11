/**
 * @fileoverview TSUP Config
 */

//Imports
import {defineConfig} from 'tsup';

//Export
export default defineConfig({
  dts: true,
  entry: [
    'src/index.ts'
  ],
  format: [
    'cjs',
    'esm'
  ],
  minify: true,
  treeshake: true
});