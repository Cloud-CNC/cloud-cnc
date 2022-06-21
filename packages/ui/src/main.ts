/**
 * @fileoverview Main app entrypoint
 */

//Imports
import App from './App.vue';
import i18n from '@/ui/lib/i18n';
import pinia from '@/ui/lib/pinia';
import router from '@/ui/lib/router';
import vuetify from '@/ui/lib/vuetify';
import {createApp} from 'vue';

//Create the app
const app = createApp(App);
app.use(vuetify);
app.use(i18n);
app.use(pinia);
app.use(router);
app.mount('#app');