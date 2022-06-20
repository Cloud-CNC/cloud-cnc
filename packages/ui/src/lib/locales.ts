/**
 * @fileoverview Locales
 */

//Imports
const rawMessages = import.meta.globEager('../locales/**/*.{yml,yaml}');

//Format
const messages = Object.fromEntries(Object.entries(rawMessages).map(([key, value]) =>
{
  //Parse the file path
  const parsed = /([^./]+)(?:\.[^.]+)+$/.exec(key);

  if (parsed == null)
  {
    throw new Error(`Failed to parse file name ${key}!`);
  }

  //Get the name
  const name = parsed[1];

  //Get the content
  const content = value?.default ?? value;

  return [name, content];
}));

//Export
export default messages;