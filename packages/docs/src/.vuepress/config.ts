/**
 * @fileoverview VuePress config
 */

//Import
import typedocPlugin from './plugins/typedoc/index';
import {defaultTheme} from '@vuepress/theme-default';
import {defineUserConfig} from 'vuepress';
import {join, resolve} from 'path';
import {searchPlugin} from '@vuepress/plugin-search';

//Resolve paths
const packagesDir = resolve(__dirname, '..', '..', '..');
const pluginSdkDir = join(packagesDir, 'plugin-sdk');
const serverDir = join(packagesDir, 'server');

//Export
export default defineUserConfig({
  title: 'Cloud CNC Docs',
  description: 'Documentation for the Cloud CNC ecosystem',
  head: [
    [
      'link',
      {
        rel: 'icon',
        href: '/icon-dark.png'
      }
    ],
    [
      'meta',
      {
        name: 'theme-color',
        content: '#191919'
      }
    ],
    [
      'meta',
      {
        name: 'apple-mobile-web-app-capable',
        content: 'yes'
      }
    ],
    [
      'meta',
      {
        name: 'apple-mobile-web-app-status-bar-style',
        content: 'black'
      }
    ]
  ],
  theme: defaultTheme({
    logo: '/icon-light.png',
    logoDark: '/icon-dark.png',
    repo: 'https://github.com/cloud-cnc/cloud-cnc',
    docsDir: 'packages/docs',
    navbar: [
      {
        text: 'Home',
        link: '/'
      },
      {
        text: 'Guides',
        link: '/guides/'
      },
      {
        text: 'Docs',
        link: '/docs/'
      }
    ],
    sidebarDepth: 1,
    sidebar: {
      '/guides/': [
        {
          text: 'Guides',
          link: '/guides/',
          children: [
            '/guides/quick-start/'
          ]
        }
      ],
      '/docs/': [
        '/docs/branding/',
        {
          text: 'Plugins',
          children: []
        }
      ]
    }
  }),
  plugins: [
    searchPlugin({
      hotKeys: [
        {
          key: '/'
        },
        {
          ctrl: true,
          key: '/'
        }
      ],
      maxSuggestions: 7
    }),
    typedocPlugin({
      input: {
        entryPointStrategy: 'expand',
        entryPoints: [
          join(pluginSdkDir, 'src'),
          join(serverDir, 'src', 'lib', 'config.ts'),
          join(serverDir, 'src', 'lib', 'hooks.ts')
        ],
        excludeInternal: true,
        includeVersion: true,
        readme: 'none',
        sort: ['source-order'],
        tsconfig: join(pluginSdkDir, 'tsconfig.json')
      },
      output: {
        prefix: '/docs/api-server/api/hooks',
        sidebar: {
          text: 'API',
          path: [
            '/docs/',
            1,
            'children',
            0
          ]
        }
      }
    })
  ]
});