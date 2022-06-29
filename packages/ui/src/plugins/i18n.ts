/**
 * @fileoverview Internationalization (i18n) plugin
 */

//Imports
import {createI18n, I18nOptions} from 'vue-i18n';
const rawMessages = import.meta.globEager('../locales/**/*.{yml,yaml}');

//Format messages
const messages = Object.fromEntries(Object.entries(rawMessages).map(([key, value]) =>
{
  //Parse the file path
  const parsed = /([^./]+)(?:\.[^.]+)+$/.exec(key);

  if (parsed == null)
  {
    throw new Error(`Failed to parse file name ${key}!`);
  }

  //Get the name
  const name = parsed[1];

  //Get the content
  const content = value?.default ?? value;

  return [name, content];
}));

//Setup internationalization
const i18n = createI18n({
  fallbackLocale: 'en',
  fallbackWarn: false,
  globalInjection: true,
  legacy: false,
  locale: 'en',
  messages
} as I18nOptions);

//Export
export default i18n;