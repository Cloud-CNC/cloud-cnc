/**
 * @fileoverview Menu items helper
 */

//Imports
import {Composer} from 'vue-i18n';
import {MenuItemData, MenuItemGroupData, MenuItemLinkData, RouteMetadata} from './types';
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
    type: 'item',
    id: route.name,
    title: i18n.t(`routes[${JSON.stringify(route.name)}].name`),
    icon: metadata?.sidebar?.icon,
    path: route.path
  } as MenuItemLinkData;

  return link;
};

/**
 * Translate routes into menu items
 * @param routes Routes
 * @param i18n Vue i18n instance
 * @returns Menu items
 */
export const translateRoutes = (routes: RouteRecordNormalized[], i18n: VueI18n) =>
{
  const items = [] as MenuItemData[];

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

    //Grouped-item
    if (metadata.sidebar?.group != null)
    {
      //Find the group parent
      let parent = items.find(item => item.type == 'group' && item.id == metadata.sidebar?.group) as MenuItemGroupData | undefined;

      //Initialize the parent if not found
      if (parent == null)
      {
        //Create the parent
        parent = {
          type: 'group',
          id: metadata.sidebar.group,
          title: i18n.t(`routes[${JSON.stringify(metadata.sidebar.group)}].name`),
          children: []
        } as MenuItemGroupData;

        //Add
        items.push(parent);
      }

      //Translate the route
      const link = translateRoute(route, i18n);

      //Add
      parent.children.push(link);
    }
    //Solo-item
    else
    {
      //Translate the route
      const link = translateRoute(route, i18n);

      //Add
      items.push(link);
    }
  }

  return items;
};