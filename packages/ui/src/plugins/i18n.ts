/**
 * @fileoverview Internationalization (i18n) plugin
 */

//Imports
import {createI18n, I18nOptions} from 'vue-i18n';
import {merge} from 'lodash-es';
const rawMessages = Object.entries(import.meta.globEager('../locales/*/*.{yml,yaml}'));

//Extract messages
const messages = {} as Record<string, object>;

for (const [path, rawMessage] of rawMessages)
{
  //Parsed the path
  const parsed = /^\.\.\/locales\/([^/]+)\/[^.]+\.(?:yml|yaml)$/.exec(path);

  if (parsed == null)
  {
    throw new Error(`Failed to parse file name ${path}!`);
  }

  //Get the locale
  const locale = parsed[1]!;

  //Get the content
  const content = rawMessage?.default ?? rawMessage;

  //Add to messages
  if (messages[locale] == null)
  {
    messages[locale] = content;
  }
  //Merge with locale
  else
  {
    messages[locale] = merge(messages[locale], content);
  }
}

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