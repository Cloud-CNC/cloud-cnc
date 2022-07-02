/**
 * @fileoverview Vite Cloud CNC-plugin-loader plugin
 */

//Imports
// import {Options} from './types';
import {Plugin} from 'vite';
// import {join} from 'path';

/**
 * Vite Cloud CNC-plugin-loader plugin factory
 * @param rawOptions Plugin options
 * @returns Plugin instance
 */
const plugin = (/*options: Partial<Options> = {
}*/) => ({
  name: 'cloud-cnc-plugin-loader',
  config: () => ({})
} as Plugin);

//Export
export default plugin;