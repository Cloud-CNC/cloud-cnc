/**
 * @fileoverview Ambient types
 * 
 * *Note: importing anything at the top level will break types!*
 */

//Augmentations
declare module '*.vue' {
  //Imports
  import type {DefineComponent} from 'vue';

  const component: DefineComponent<{}, {}, any>;

  //Export
  export default component;
}

declare module '*.yml' {
  const content: unknown;

  //Export
  export default content;
}