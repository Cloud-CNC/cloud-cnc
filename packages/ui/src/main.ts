/**
 * @fileoverview Main app entrypoint
 */

//Imports
import App from './App.vue';
import generatedRoutes from 'virtual:generated-pages';
import messages from '@/ui/lib/locales';
import {Inkline, PluginConfig as InklineConfig, components} from '@inkline/inkline';
import {createApp} from 'vue';
import {createI18n, I18nOptions} from 'vue-i18n';
import {createRouter, createWebHistory} from 'vue-router';
import {setupLayouts} from 'virtual:generated-layouts';

//Styles
import '@inkline/inkline/inkline.scss';
import './main.scss';

//Setup layouts
const routes = setupLayouts(generatedRoutes);

//Setup the router
const router = createRouter({
  routes,
  history: createWebHistory()
});

//Setup internationalization
const i18n = createI18n({
  globalInjection: true,
  legacy: false,
  locale: 'en',
  messages
} as I18nOptions);

//Create the app
const app = createApp(App);
app.use(Inkline, {
  components
} as InklineConfig);
app.use(i18n);
app.use(router);
app.mount('#app');