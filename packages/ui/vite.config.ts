/* eslint-disable camelcase */
/**
 * @fileoverview Vite config
 * 
 * Inspired by https://github.com/antfu/vitesse
 */

//Imports
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import Layouts from 'vite-plugin-vue-layouts';
import Pages from 'vite-plugin-pages';
import Paths from 'vite-tsconfig-paths';
import Vue from '@vitejs/plugin-vue';
import Yaml from '@rollup/plugin-yaml';
import {InklineResolver} from 'unplugin-vue-components/resolvers';
import {VitePWA} from 'vite-plugin-pwa';
import {defineConfig} from 'vite';

//Export
export default defineConfig({
  plugins: [
    Paths(),
    Vue(),
    Pages(),
    Layouts(),
    AutoImport(),
    Components({
      resolvers: [
        IconsResolver({
          prefix: ''
        }),
        InklineResolver()
      ]
    }),
    Icons(),
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
  ]
});
