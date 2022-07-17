/* eslint-disable camelcase */
/**
 * @fileoverview Vite config
 * 
 * Inspired by https://github.com/antfu/vitesse
 */

//Imports
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import Layouts from 'vite-plugin-vue-layouts';
import Licenses from './plugins/licenses';
import Metadata from './plugins/metadata';
import Pages from 'vite-plugin-pages';
import Paths from 'vite-tsconfig-paths';
import Portals from './plugins/portals';
import Vue from '@vitejs/plugin-vue';
import Yaml from '@rollup/plugin-yaml';
import loadPlugins from './lib/plugin';
import {VitePWA} from 'vite-plugin-pwa';
import {Vuetify3Resolver} from 'unplugin-vue-components/resolvers';
import {defineConfig, UserConfig} from 'vite';
import {dirname, join} from 'path';
import {fileURLToPath} from 'url';

//Export
export default defineConfig(async env =>
{
  //Get the directory name
  const dir = dirname(fileURLToPath(import.meta.url));

  //Define the initial config
  let config = {
    root: join(dir, '.merged'),
    plugins: [
      Licenses({
        root: join(dir, '..', '..')
      }),
      Metadata(),
      Paths({
        projects: [
          join(dir, 'tsconfig.json')
        ]
      }),
      Vue(),
      Pages(),
      Layouts(),
      Portals(),
      AutoImport({
        imports: [
          '@vueuse/core',
          '@vueuse/head',
          'pinia',
          'vee-validate',
          'vue',
          'vue-i18n',
          'vue-router',
          {
            '~/ui/composables/wormhole': [
              'useBlackHole',
              'useWhiteHole'
            ]
          }
        ]
      }),
      Components({
        resolvers: [
          Vuetify3Resolver()
        ]
      }),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'Cloud CNC',
          short_name: 'Cloud CNC',
          description: 'Scalable CNC machine orchestration',
          theme_color: '#2196f3',
          background_color: '#191919',
          icons: [
            {
              src: '/android-chrome-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/android-chrome-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      }),
      Yaml()
    ],
    test: {
      include: [
        join(dir, 'src', '{components,layouts,pages}', '**', '*.spec.ts')
      ],
      testTimeout: 15000
    }
  } as UserConfig;

  //Load plugins
  config = await loadPlugins(dir, config, env);

  return config;
});
