/**
 * @fileoverview TypeDoc theme
 */

//Imports
import {MarkdownTheme} from 'typedoc-plugin-markdown';
import {NavigationItem} from 'typedoc-plugin-markdown/dist/navigation-item';
import {Options, OptionsReader, Renderer} from 'typedoc';
import {SidebarInformation} from './types';
import {formatPath} from './utils';

/**
 * VuePress TypeDoc theme
 */
export class VuepressTheme extends MarkdownTheme
{
  /**
   * Path prefix (eg: `/api/`)
   */
  private prefix: string;

  constructor(renderer: Renderer)
  {
    //Instantiate parent
    super(renderer);

    //Update state
    this.prefix = this.getOption('prefix') as string;
  }

  /**
   * Transform the absolute URL into a relative one
   * @param absolute Absolute URL
   * @returns Relative URL
   */
  getRelativeUrl(absolute: string): string
  {
    //Format the path
    return formatPath(this.prefix, absolute);
  }

  /**
   * Get sidebar information
   * @param navigation Navigation information
   * @returns Sidebar information
   */
  getSidebar(navigation: NavigationItem): SidebarInformation
  {
    const info = {
      text: navigation.title
    } as SidebarInformation;

    //Add link
    if (navigation.url != '')
    {
      info.link = formatPath(this.prefix, navigation.url);
    }

    //Add children
    if (navigation.children != null && navigation.children.length > 0)
    {
      info.children = navigation.children.map(child => this.getSidebar(child));
    }

    return info;
  }
}

/**
 * Options reader
 * 
 * This is required to override the theme value
 * 
 * @see https://github.com/tgreyuk/typedoc-plugin-markdown/blob/master/packages/typedoc-plugin-markdown/src/options-reader.ts
 */
export class VuepressThemeOptionsReader implements OptionsReader
{
  name = 'vuepress-theme-reader';
  priority = 2000;

  read(options: Options)
  {
    //Override theme value
    if (['default', 'markdown'].includes(options.getValue('theme')))
    {
      options.setValue('theme', 'vuepress');
    }
  }
}