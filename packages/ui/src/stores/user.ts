/**
 * @fileoverview Theme store
 */

//Imports
import {useTheme} from 'vuetify';

/**
 * Locale store
 */
export const useLocaleStore = defineStore('locale', () =>
{
  //Compositions
  const i18n = useI18n();
  const languages = usePreferredLanguages();
  const locale = useStorage('locale', '');

  //Effects
  watch(languages, () =>
  {
    //Update the locale
    if (languages.value.length > 0)
    {
      locale.value = languages.value[0];
    }
  });

  watchEffect(() =>
  {
    //Update the locale
    i18n.locale.value = locale.value;
  });

  //Methods
  const setLocale = (value: string) => locale.value = value;

  return {
    locale,
    setLocale
  };
});

/**
 * Theme store
 */
export const useThemeStore = defineStore('theme', () =>
{
  //Compositions
  const dark = useDark();
  const theme = useTheme();

  //Effects
  watchEffect(() =>
  {
    //Update the theme
    theme.global.name.value = dark.value ? 'dark' : 'light';
  });

  //Methods
  const toggle = () => dark.value = !dark.value;

  return {
    dark,
    toggle
  };
});