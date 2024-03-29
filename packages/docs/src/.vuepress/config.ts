/**
 * @fileoverview VuePress config
 */

//Import
import typedocPlugin from './plugins/typedoc';
import {defaultTheme} from '@vuepress/theme-default';
import {defineUserConfig} from 'vuepress';
import {join} from 'path';
import {mdEnhancePlugin} from 'vuepress-plugin-md-enhance';
import {registerComponentsPlugin} from '@vuepress/plugin-register-components';
import {searchPlugin} from '@vuepress/plugin-search';

//Resolve paths
const packagesDir = join(__dirname, '..', '..', '..');
const pluginSdkDir = join(packagesDir, 'plugin-sdk');
const serverDir = join(packagesDir, 'server');

//Export
export default defineUserConfig({
  title: 'Cloud CNC',
  description: 'Documentation for the Cloud CNC ecosystem',
  head: [
    [
      'link',
      {
        rel: 'icon',
        href: '/logo.webp'
      }
    ],
    [
      'meta',
      {
        name: 'theme-color',
        content: '#2196f3'
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
    logo: '/logo.webp',
    repo: 'https://github.com/cloud-cnc/cloud-cnc',
    docsDir: 'packages/docs/src',
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
            '/guides/quick-start',
            '/guides/search',
          ]
        }
      ],
      '/docs/': [
        '/docs/branding/',
        {
          text: 'API',
          link: '/docs/api',
          children: [
            {
              text: 'HTTP API',
              link: '/docs/api/http'
            },
            {
              text: 'Websocket API',
              link: '/docs/api/websocket'
            }
          ]
        },
        {
          text: 'Plugins',
          link: '/docs/plugins/',
          children: [
            {
              text: 'Specification',
              link: '/docs/plugins/specification'
            },
            '' //Injected by TypeDoc plugin
          ]
        }
      ]
    }
  }),
  plugins: [
    registerComponentsPlugin({
      componentsDir: join(__dirname, 'components')
    }),
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
    mdEnhancePlugin({
      chart: true,
      codetabs: true,
      mermaid: true,
      tabs: true
    }),
    typedocPlugin({
      typedoc: {
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
      prefix: '/docs/plugins/api',
      sidebar: {
        show: true,
        text: 'API',
        path: [
          '/docs/',
          2,
          'children',
          1
        ]
      }
    })
  ]
});