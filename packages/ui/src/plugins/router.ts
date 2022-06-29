/**
 * @fileoverview Router plugin
 */

//Imports
import generatedRoutes from 'virtual:generated-pages';
import {setupLayouts} from 'virtual:generated-layouts';
import {createRouter, createWebHistory} from 'vue-router';

//Setup layouts
const routes = setupLayouts(generatedRoutes);

//Setup the router
const router = createRouter({
  routes,
  history: createWebHistory()
});

//Export
export default router;