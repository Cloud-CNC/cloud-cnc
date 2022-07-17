/**
 * @fileoverview Type augmentations
 */

//Imports
import 'vite';

declare module 'vite' {
  interface UserConfig {
    /**
     * Portal entries (Used to patch target components so they load plugin components)
     * 
     * * Keys: plugin portal component path (Relative to the merged directory)
     * * Values: plugin target component path (Relative to the merged directory)
     */
    portals?: Record<string, string>;
  }
}