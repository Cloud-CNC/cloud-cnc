/**
 * @fileoverview App log
 * 
 * This file cannot use the config (due to a dependency loop) but should still
 * follow it's principles
 */

//Imports
import 'dotenv/config';
import pino from 'pino';

//Get the level
let level: string;
switch (process.env.NODE_ENV)
{
  case 'development':
    level = 'debug';
    break;

  case 'test':
    level = 'warn';
    break;

  default:
    level = 'info';
    break;
}

//Setup the log
const log = pino({
  formatters: {
    level: label => ({level: label})
  },
  level,
  transport: process.env.PRETTY == 'true' ? {
    target: 'pino-pretty'
  } : undefined
});

//Export
export default log;