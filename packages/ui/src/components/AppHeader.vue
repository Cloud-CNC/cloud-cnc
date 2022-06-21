<script setup lang="ts">
//Imports
import {useLocaleStore, useThemeStore} from '@/ui/stores/user';

//Events
const emit = defineEmits<(e: 'openSidebar') => void>();

//Compositions
const {locale, setLocale} = useLocaleStore();
const theme = useThemeStore();
const i18n = useI18n();

//Computed
const icon = computed(() => theme.dark ? 'Sun' : 'Moon');
const locales = computed(() => i18n.availableLocales.map(locale => ({
  title: i18n.t('meta.name', {}, {
    locale
  }),
  value: locale
})));
</script>

<template>
  <v-app-bar app>
    <!-- Hamburger button -->
    <v-app-bar-nav-icon @click="emit('openSidebar')" />

    <template #append>
      <!-- Invert colors -->
      <v-btn color="info" :icon="icon" @click="theme.toggle" />

      <!-- Change locale -->
      <v-menu open-on-hover>
        <template #activator="{props}">
          <v-btn color="info" icon="Languages" v-bind="props" />
        </template>

        <v-list class="locales" :items="locales" :selected="[locale]" @click:select="setLocale($event.id)" />
      </v-menu>
    </template>
  </v-app-bar>
</template>

<style scoped>
.locales {
  position: absolute;
  right: 0;
  height: fit-content !important;
  width: fit-content;
}
</style>