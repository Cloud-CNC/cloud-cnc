/**
 * @fileoverview Main app entrypoint
 */

//Imports
import App from './App.vue';
import {createApp} from 'vue';
const plugins = Object.values(import.meta.globEager('./plugins/**/*.ts'));

//Create the app
const app = createApp(App);

//Add plugins
for (const plugin of plugins)
{
  if (plugin.default != null)
  {
    app.use(plugin.default);
  }
}

//Mount the app
app.mount('#app');