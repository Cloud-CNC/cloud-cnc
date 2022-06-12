/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * @fileoverview TypeScript type augmentations
 */

//Imports
import {ExtendableContext} from 'koa';

declare module 'koa'
{
  interface ExtendableContext
  {
    /**
     * Safe (sanitized and validated) request arguments
     */
    safe: {
      body: any;
      params: any;
      query: any;
    };
  }
}