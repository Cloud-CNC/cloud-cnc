/**
 * @fileoverview Playwright config
 */

//Imports
import {PlaywrightTestConfig} from '@playwright/test';

//Declare the config
const config = {
  timeout: 30000
} as PlaywrightTestConfig;

//Export
export default config;