/**
 * @fileoverview Menu items helper
 */

//Imports
import {Composer} from 'vue-i18n';
import {IMenuItemData, MenuItemGroupData, MenuItemLinkData, RouteMetadata} from './types';
import {RouteRecordNormalized} from 'vue-router';

//Vue i18n instance type
type VueI18n = Composer<unknown, unknown, unknown>;

/**
 * Translate the route into a menu item link
 * @param route Route
 * @param i18n Vue i18n instance
 * @returns Menu item link
 */
const translateRoute = (route: RouteRecordNormalized, i18n: VueI18n) =>
{
  //Cast the metadata
  const metadata = route.meta as unknown as RouteMetadata | undefined;

  //Translate the route
  const link = {
    type: 'link',
    id: route.name,
    title: i18n.t(`routes[${JSON.stringify(route.name)}].name`),
    icon: metadata?.sidebar?.icon,
    sort: metadata?.sidebar?.sort,
    path: route.path
  } as MenuItemLinkData;

  return link;
};

/**
 * Inserts the item into items using insertion sort
 * 
 * *Note: modifies `items`!*
 * @param item Item to insert
 * @param items Array to insert into
 */
const insertItem = (item: IMenuItemData, items: IMenuItemData[]) =>
{
  let inserted = false;
  for (const [i, current] of items.entries())
  {
    //Insert the item before current
    if (
      current.type != 'link' || //Insert if we have passed the links and are onto the groups
      (item.type == 'link' && (((current as MenuItemLinkData).sort ?? 0) > ((item as MenuItemLinkData).sort ?? 0))) //Insert if the item has a lower priority than the current item
    )
    {
      items.splice(i, 0, item);
      inserted = true;
      break;
    }
  }

  //Insert if we haven't already
  if (!inserted)
  {
    items.push(item);
  }
};

/**
 * Translate routes into menu items
 * @param routes Routes
 * @param i18n Vue i18n instance
 * @returns Menu items
 */
export const translateRoutes = (routes: RouteRecordNormalized[], i18n: VueI18n) =>
{
  const items = [] as IMenuItemData[];

  //Filter and aggregate
  for (const route of routes)
  {
    //Cast the metadata
    const metadata = route.meta as unknown as RouteMetadata | undefined;

    //Skip routes missing a name/metadata or that are hidden
    if (route.name == null || metadata == null || metadata.sidebar == null || metadata.sidebar.hidden)
    {
      continue;
    }

    //Generate the item
    let item: IMenuItemData;

    //Grouped-item
    if (metadata.sidebar?.group != null)
    {
      //Find the group parent
      item = items.find(item => item.type == 'group' && item.id == metadata.sidebar?.group) as MenuItemGroupData;

      //Initialize the parent if not found
      if (item == null)
      {
        //Create the parent
        item = {
          type: 'group',
          id: metadata.sidebar.group,
          title: i18n.t(`routes[${JSON.stringify(metadata.sidebar.group)}].name`),
          children: []
        } as MenuItemGroupData;
      }

      //Translate the route
      const child = translateRoute(route, i18n);

      //Insert the child
      insertItem(child, (item as MenuItemGroupData).children);
    }
    //Solo-item
    else
    {
      //Translate the route
      item = translateRoute(route, i18n);
    }

    //Insert the item
    insertItem(item, items);
  }

  return items;
};