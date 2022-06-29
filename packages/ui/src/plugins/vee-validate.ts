/**
 * @fileoverview Vee Validate plugin
 */

//Imports
import {configure} from 'vee-validate';
import {Plugin} from 'vue';

/**
 * Vee Validate plugin
 */
const plugin = {
  install: app =>
  {
    app.mixin({
      beforeCreate()
      {
        //Compositions
        const i18n = useI18n();

        //Configure Vee Validate
        configure({
          generateMessage: ctx =>
          {
            return i18n.t('plugins.veevalidate.invalid', {
              field: ctx.field
            });
          }
        });
      }
    });
  }
} as Plugin;

//Export
export default plugin;