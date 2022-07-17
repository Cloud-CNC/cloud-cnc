/**
 * @fileoverview Vite licenses plugin
 */

//Imports
import {Options} from './types';
import {Plugin} from 'vite';
import {aggregate} from './utils';

/**
 * Vite licenses plugin factory
 * @param rawOptions Plugin options
 * @returns Plugin instance
 */
const plugin = (options: Partial<Options> = {
  path: 'licenses.txt',
  root: process.cwd()
}) => ({
  name: 'licenses',
  apply: 'build',
  config: () => ({
    define: {
      'import.meta.env.LICENSES_PATH': JSON.stringify(options.path)
    }
  }),
  async buildStart()
  {
    //Aggregate all licenses
    const licenses = await aggregate(options.root!);

    //Format all licenses
    const raw = licenses.map(license =>
    {
      //Format the title
      const title = license.packages.map(licensePackage => `${licensePackage.name} (${licensePackage.url})`).join('\r\n');

      //Format the license
      return `${title}\r\n\r\n${license.text}`;
    }).join(`\r\n\r\n${'-'.repeat(80)}\r\n\r\n`);

    //Emit the file
    this.emitFile({
      type: 'asset',
      fileName: options.path,
      source: raw
    });
  }
} as Plugin);

//Export
export default plugin;