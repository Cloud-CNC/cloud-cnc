/**
 * @fileoverview TypeDoc utilities
 */

//Imports
import {App} from '@vuepress/core';
import {fs} from '@vuepress/utils';
import {join} from 'path/posix';
import {vuepressSlugify} from '@vuepress/markdown';

/**
 * Dummy URL scheme
 */
const URL_SCHEME = 'invalid://';

/**
 * Inject content into a temporary file created with `app.writeTemp`, adding/replacing content as
 * necessary
 * @param app VuePress app
 * @param file File name
 * @param id Content tracking ID
 * @param content Content to append (New content will override existing content with the same
 * tracking ID)
 */
export const injectTemp = async (app: App, file: string, id: string, content: string) =>
{
  //Resolve the full path
  const path = app.dir.temp(file);

  //Read the file
  let raw = await fs.readFile(path, 'utf-8');

  //Compute the header and footer
  const header = `\r\n/* -----BEGIN CONTENT ${id}----- */\r\n`;
  const footer = `\r\n/* -----END CONTENT ${id}----- */\r\n`;

  //Format the content
  const formatted = header + content + footer;

  //Replace content
  if (raw.includes(header) && raw.includes(footer))
  {
    raw = raw.substring(0, raw.indexOf(header)) + formatted + raw.substring(raw.indexOf(footer) + footer.length);
  }
  //Append content
  else
  {
    raw += formatted;
  }

  //Save the file
  await fs.writeFile(path, raw);
}

/**
 * Format the path
 * @param prefix Path prefix (eg: `/api/`)
 * @param raw Raw path
 */
export const formatPath = (prefix: string, raw: string) =>
{
  //Parse the URL
  const parsed = new URL(raw, URL_SCHEME);

  //Strip extensions
  parsed.pathname = parsed.pathname.replace(/(.+)\.[^.]+$/, '$1');

  //Strip README and index
  parsed.pathname = parsed.pathname.replace(/README|index/, '');

  //Add trailing slash
  if (!parsed.pathname.endsWith('/'))
  {
    parsed.pathname += '/';
  }

  //Slugify the fragment
  if (parsed.hash.length > 0)
  {
    parsed.hash = vuepressSlugify(parsed.hash.substring(1));
  }

  //Stringify
  let url = parsed.toString().toLowerCase();

  //Strip the scheme
  url = url.replace(URL_SCHEME, '');

  //Add the prefix
  url = join(prefix, url);

  return url;
};