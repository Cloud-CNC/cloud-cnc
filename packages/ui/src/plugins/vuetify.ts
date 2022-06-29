/**
 * @fileoverview Vuetify plugin
 */

//Imports
import 'vuetify/styles';
import Icon from '@/ui/components/Icon.vue';
import i18n from './i18n';
//@ts-expect-error Vuetify types are incomplete
import {createVueI18nAdapter} from 'vuetify/locale/adapters/vue-i18n';
import {createVuetify, ThemeDefinition} from 'vuetify';

//Colors
const colors = {
  primary: '#2196f3',
  secondary: '#304fff'
} as ThemeDefinition['colors'];

//Export
export default createVuetify({
  icons: {
    //See https://github.com/vuetifyjs/vuetify/blob/next/packages/vuetify/src/iconsets/mdi.ts
    aliases: {
      cancel: 'XCircle',
      checkboxIndeterminate: 'MinusSquare',
      checkboxOff: 'Square',
      checkboxOn: 'CheckSquare',
      clear: 'XCircle',
      close: 'X',
      collapse: 'ChevronUp',
      complete: 'Check',
      delete: 'XCircle',
      delimiter: 'Circle',
      dropdown: 'ChevronDown',
      edit: 'Pencil',
      error: 'XCircle',
      expand: 'ChevronDown',
      file: 'Paperclip',
      first: 'ChevronFirst',
      info: 'Info',
      last: 'ChevronLast',
      loading: 'RefreshCcw',
      menu: 'Menu',
      minus: 'Minus',
      next: 'ChevronRight',
      plus: 'Plus',
      prev: 'ChevronLeft',
      radioOff: 'Circle',
      radioOn: 'CheckCircle_2',
      ratingEmpty: '',
      ratingFull: 'Star',
      ratingHalf: 'StarHalf',
      sort: 'ArrowUp',
      subgroup: 'ChevronDown',
      success: 'CheckCircle',
      unfold: 'ChevronsUpDown',
      warning: 'AlertCircle'
    },
    defaultSet: 'lucide',
    sets: {
      lucide: {
        component: Icon
      }
    }
  },
  locale: createVueI18nAdapter({
    i18n,
    useI18n
  }),
  theme: {
    themes: {
      dark: {
        colors,
        dark: true
      },
      light: {
        colors,
        dark: false
      }
    }
  }
});