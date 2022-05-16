/**
 * @fileoverview Typescript type augmentation
 */

import {Context} from 'koa';

declare module 'koa' {
  interface Context {
    session: {
      aaaa: boolean;
    }
  }
}