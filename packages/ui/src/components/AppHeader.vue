<script setup lang="ts">
//Imports
import {useLocaleStore, useThemeStore} from '@/ui/stores/user';

//Events
const emit = defineEmits<(e: 'openSidebar') => void>();

//Props
const props = withDefaults(defineProps<{
  collapse?: boolean;
  float?: 'left' | 'right';
  showNavButton?: boolean;
  showRouteTitle?: boolean;
}>(), {
  collapse: false,
  float: 'right',
  showNavButton: true,
  showRouteTitle: true
});

//Compositions
const {locale, setLocale} = useLocaleStore();
const theme = useThemeStore();
const i18n = useI18n();

//Computed
const themeIcon = computed(() => theme.dark ? 'Sun' : 'Moon');
const locales = computed(() => i18n.availableLocales.map(locale => ({
  title: i18n.t('meta.name', {}, {
    locale
  }),
  value: locale
})));
</script>

<template>
  <v-app-bar
    app :class="{
      'app-bar-right': props.collapse && props.float == 'right'
    }" :collapse="props.collapse"
  >
    <!-- Hamburger/nav button -->
    <v-app-bar-nav-icon v-if="props.showNavButton" @click="emit('openSidebar')" />

    <!-- Route title -->
    <v-app-bar-title v-if="props.showRouteTitle">
      {{ $t(`routes[${JSON.stringify($route.name)}].name`) }}
    </v-app-bar-title>

    <template #append>
      <!-- Invert colors -->
      <v-btn color="info" :icon="themeIcon" @click="theme.toggle" />

      <!-- Change locale -->
      <v-menu open-on-hover>
        <template #activator="{props: activatorProps}">
          <v-btn color="info" icon="Languages" v-bind="activatorProps" />
        </template>

        <v-list class="locales" :items="locales" :selected="[locale]" @click:select="setLocale($event.id)" />
      </v-menu>
    </template>
  </v-app-bar>
</template>

<style scoped>
.app-bar-right {
  right: 0;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 0;
}

.locales {
  position: absolute;
  right: 0;
  height: fit-content !important;
  width: fit-content;
}
</style>