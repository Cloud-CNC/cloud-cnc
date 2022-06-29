/**
 * @fileoverview TypeScript types
 */

/**
 * Common menu item data interface
 */
export interface IMenuItemData
{
  /**
   * Item type
   */
  type: string;

  /**
   * Item identifier
   */
  id: string;

  /**
   * Item display title
   */
  title: string;
}

/**
 * Menu item link data
 */
export interface MenuItemLinkData extends IMenuItemData
{
  type: 'item';

  /**
   * Item icon name (PascalCase; eg: `LampDesk`)
   */
  icon: string;

  /**
   * Item path
   */
  path: string;
}

/**
 * Menu item group
 */
export interface MenuItemGroupData extends IMenuItemData
{
  type: 'group';

  /**
   * Child items
   */
  children: MenuItemData[];
}

/**
 * Menu item data
 */
export type MenuItemData = MenuItemLinkData | MenuItemGroupData;

/**
 * Standardized route metadata
 * 
 * *Note: the route name is used for the menu item ID.*
 */
export interface RouteMetadata
{
  /**
   * Whether or not the route is publicly-accessible (ie: without authentication)
   */
  public: boolean;

  /**
   * Sidebar metadata
   */
  sidebar?: {
    /**
     * Whether or not the route should be displayed in the sidebar
     */
    hidden: boolean;

    /**
     * Icon name (PascalCase; eg: `LampDesk`)
     * 
     * @see https://lucide.dev
     */
    icon?: string;

    /**
     * Group ID
     */
    group?: string;
  };
}