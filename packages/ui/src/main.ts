/**
 * @fileoverview Main app entrypoint
 */

//Imports
import App from './App.vue';
import {createApp} from 'vue';
const plugins = import.meta.globEager('./plugins/**/*.ts');

//Create the app
const app = createApp(App);

//Add plugins
for (const plugin of Object.values(plugins))
{
  if (plugin.default != null)
  {
    app.use(plugin.default);
  }
}

//Mount the app
app.mount('#app');