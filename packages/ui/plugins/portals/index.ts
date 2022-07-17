/**
 * @fileoverview Vite plugin-portals loader plugin
 */

//Imports
import {Plugin} from 'vite';
import {SFCScriptBlock, SFCTemplateBlock, parse} from 'vue/compiler-sfc';
import {generateRandomSymbol} from './utils';
import {inject, stringify} from '../../lib/sfc';
import {normalize, relative} from 'path';

/**
 * Project root directory
 */
let root: string;

/**
 * Portal entries (Used to patch target components so they load plugin components)
 * 
 * * Keys: plugin portal component path (Relative to the merged directory)
 * * Values: plugin target component path (Relative to the merged directory)
 */
let portals = [] as [string, string][];

/**
 * Vite plugin-portals loader plugin factory
 * @returns Plugin instance
 */
const plugin = () => ({
  name: 'portals',
  enforce: 'pre',
  config: config =>
  {
    //Update project root
    root = config.root ?? process.cwd();

    //Normalize and update portal entries
    if (config.portals != null)
    {
      portals = Object.entries(config.portals).map(([key, value]) => ([
        normalize(key),
        normalize(value)
      ]));
    }
  },
  transform(code, id)
  {
    //Get the relative module path
    const path = relative(root, id);

    //Get plugin portal components
    const components = portals.flatMap(([key, value]) => value == path ? [key] : []);

    //Skip if not targeted
    if (components.length == 0)
    {
      return null;
    }

    //Parse the code
    const parsed = parse(code, {
      filename: id
    });

    if (parsed.errors.length > 0)
    {
      throw new Error(`Failed to parse Vue SFC ${parsed.errors.map(error => error.message).join(' ')}`);
    }

    //Generate a random import symbol
    const symbols = components.map(() => generateRandomSymbol('portal'));

    //Inject the import statement
    parsed.descriptor.scriptSetup = inject<SFCScriptBlock>(
      parsed.descriptor.scriptSetup,
      {
        attrs: {},
        content: '',
        loc: {} as any,
        type: 'script'
      },
      `
/* Plugin portals */
${components.map((component, index) => `import ${symbols[index]} from ${JSON.stringify(component)};`)}
`
    );

    //Inject the plugin component instantiation
    parsed.descriptor.template = inject<SFCTemplateBlock>(
      parsed.descriptor.template,
      {
        ast: {} as any,
        attrs: {},
        content: '',
        loc: {} as any,
        type: 'template'
      },
      undefined,
      `
  <div class="plugin-portals">
    ${components.map((_, index) => `<${symbols[index]} />`)}
  </div>
`
    );

    //Stringify
    const updated = stringify(parsed.descriptor);

    return updated;
  }
} as Plugin);

//Export
export default plugin;