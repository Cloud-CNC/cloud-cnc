/**
 * @fileoverview TypeDoc plugin
 */

//Imports
import {merge} from 'lodash';
import {injectTemp} from './utils';
import {PluginObject, createPage} from '@vuepress/core';
import {Options} from './types';
import render from './typedoc';

//State
const oldPageKeys: string[] = [];
let sidebarPath: string | undefined;
let sidebarItem: string | undefined;

/**
 * TypeDoc VuePress plugin
 * @param options Plugin options
 * @returns Plugin instance
 */
const plugin = (options: Options) =>
{
  //Validate options
  if (options.input == null)
  {
    throw new Error('[TypeDoc Plugin] Input option must be specified!');
  }

  //Add defaults
  options = merge({
    output: {
      prefix: '/api/',
      sidebar: {
        show: true
      }
    }
  } as Options, options);

  return {
    name: 'typedoc',
    multiple: true,
    onInitialized: async app =>
    {
      //Render the app
      await render(options as Options, app.env.isDev, async (pages, sidebar) =>
      {
        //Remove old pages
        app.pages = app.pages.filter(page => !oldPageKeys.includes(page.key));

        //Add new pages
        for (const page of pages)
        {
          //Create the VuePress page
          const vuepressPage = await createPage(app, page);

          //Add the page
          app.pages.push(vuepressPage);

          //Store the key for later
          oldPageKeys.push(vuepressPage.key);
        }

        //Add sidebar information
        if (sidebar != null)
        {
          //Format sidebar information
          sidebarPath = options.output!.sidebar!.path != null ? JSON.stringify(options.output!.sidebar!.path, null, 2) : undefined;
          sidebarItem = JSON.stringify(sidebar, null, 2);
        }
      });
    },
    // onPrepared: pluginHandler(options as Options, true),
    onPrepared: async app =>
    {
      //Add sidebar information
      if (sidebarItem != null)
      {
        //Inject a script to override the themeData sidebar property
        await injectTemp(app, 'internal/themeData.js', 'cdb9b510-ff55-4739-b4fd-d170959e8b1c', `//TypeDoc plugin
      if (themeData != null)
      {
        //Passed data
        const sidebarItem = ${sidebarItem};
        const sidebarPath = ${sidebarPath};
      
        /**
         * Recursively set the property of \`object\` at \`path\` to \`value\`
         * @param object Object to modify
         * @param path Array of keys (Use strings with objects and numbers with arrays)
         * @param value Value to set
         */
        const set = (object, path, value) =>
        {
          //Get the next path fragment
          const fragment = path.shift();
      
          //Set the value
          if (path.length == 0)
          {
            object[fragment] = value;
            return;
          }
      
          //Create the value
          if (object[fragment] == null)
          {
            //Create an object
            if (typeof path[0] == 'string')
            {
              object[fragment] = {};
            }
            //Create an array
            else
            {
              object[fragment] = [];
            }
          }
      
          //Recur
          return set(object[fragment], path, value);
        };
      
        //Inject the item
        if (sidebarPath == null)
        {
          if (Array.isArray(themeData.sidebar))
          {
            themeData.sidebar.push(sidebarItem);
          }
          else if (typeof themeData.sidebar == 'object')
          {
            themeData.sidebar['/api/'] = [sidebarItem];
          }
          else if (typeof themeData.sidebar == 'string')
          {
            themeData.sidebar = [sidebarItem];
          }
          else
          {
            console.error('[TypeDoc Plugin] Could not inject sidebar items because the sidebar is disabled!');
          }
        }
        else
        {  
          set(themeData.sidebar, sidebarPath, sidebarItem);
        }
      
        //Log
        if (__VUEPRESS_DEV__)
        {
          console.log('[TypeDoc Plugin] The current sidebar config is:', JSON.stringify(themeData.sidebar, null, 2));
        }
      }
      else
      {
        console.error('[TypeDoc Plugin] Could not inject sidebar items because themeData is not defined!');
      }`);
      }
    }
  } as PluginObject;
};

//Export
export default plugin;