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
import License from './plugins/licenses/index';
import Pages from 'vite-plugin-pages';
import Paths from 'vite-tsconfig-paths';
import Vue from '@vitejs/plugin-vue';
import Yaml from '@rollup/plugin-yaml';
import {VitePWA} from 'vite-plugin-pwa';
import {Vuetify3Resolver} from 'unplugin-vue-components/resolvers';
import {branch, long as commit, remoteUrl} from 'git-rev-sync';
import {defineConfig} from 'vite';
import {join} from 'path';
import {version as version} from './package.json';

//Export
export default defineConfig({
  define: {
    'import.meta.env.GIT_BRANCH': JSON.stringify(branch()),
    'import.meta.env.GIT_COMMIT': JSON.stringify(commit()),
    'import.meta.env.GIT_REMOTE': JSON.stringify(remoteUrl()),
    'import.meta.env.VERSION': JSON.stringify(version)
  },
  plugins: [
    License(),
    Paths(),
    Vue(),
    Pages(),
    Layouts(),
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
          '@/ui/composables/wormhole': [
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
      join(__dirname, 'src', '{components,layouts,pages}', '**', '*.spec.ts')
    ],
    testTimeout: 15000
  }
});
