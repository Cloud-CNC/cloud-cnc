/**
 * @fileoverview Vue SFC helpers
 */

//Imports
import jstoxml from 'jstoxml';
import {SFCBlock, SFCDescriptor} from 'vue/compiler-sfc';

/**
 * Inject content into a parsed Vue SFC block
 * @param block Parsed block
 * @param init Initial block
 * @param prepend Content to prepend the original block content with
 * @param append Content to append the original block content with
 */
export const inject = <T extends SFCBlock>(block: T | null, init: T, prepend?: string, append?: string): T =>
{
  //Initialize the block
  if (block == null)
  {
    block = init;
  }

  //Add content
  if (prepend)
  {
    block.content = prepend + block.content;
  }

  if (append)
  {
    block.content += append;
  }

  return block;
};

/**
 * Stringify a parsed Vue SFC block
 * @param block Parsed block
 * @returns Block source code 
 */
const stringifyBlock = (block: SFCBlock) => jstoxml.toXML({
  _attrs: block.attrs,
  _content: block.content,
  _name: block.type
}, {
  //@ts-expect-error jstoxml types are outdated
  attributeReplacements: false,
  contentReplacements: false
});

/**
 * Stringify a parsed Vue SFC
 * @param descriptor Parsed descriptor
 * @returns Source code
 */
export const stringify = (descriptor: SFCDescriptor) =>
{
  //Aggregate blocks
  const blocks = [
    ...descriptor.customBlocks,
    descriptor.script,
    descriptor.scriptSetup,
    ...descriptor.styles,
    descriptor.template
  ].filter(block => block != null) as SFCBlock[];

  //Stringify blocks
  let code = '';
  for (const block of blocks)
  {
    code += `\r\n${stringifyBlock(block)}\r\n`;
  }

  return code;
};