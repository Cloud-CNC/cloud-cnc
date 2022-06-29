/**
 * @fileoverview TypeScript types
 */

//Imports
import {TypeDocOptions} from 'typedoc';
import {SidebarItem, SidebarGroup} from '@vuepress/theme-default';

/**
 * Sidebar information
 */
export type SidebarInformation = SidebarItem & SidebarGroup;

/**
 * Plugin options
 */
export interface Options
{
  /**
   * TypeDoc options
   */
  typedoc: Partial<TypeDocOptions> & {
    [k: string]: any
  };

  /**
   * Path prefix (eg: `/api/`)
   * @default `/api/`
   */
  prefix: string;

  /**
   * Sidebar item-injection options
   */
  sidebar: {
    /**
     * Whether or not to automatically add pages to the sidebar (Requires the default theme or a
     * descendent of it)
     */
    show: boolean;

    /**
     * Top-most item text
     * @default TypeDoc generated one
     */
    text?: string;

    /**
     * Path to inject the top-most item at relative to the theme's `sidebar` property
     * 
     * **Note: use numbers for indexing arrays and strings for indexing objects**
     * @default Root-level
     */
    path?: (number | string)[];
  };
}