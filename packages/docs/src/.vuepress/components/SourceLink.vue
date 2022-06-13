<script setup lang="ts">
//Imports
import {computed} from 'vue';
import {useThemeLocaleData} from '@vuepress/plugin-theme-data/lib/client';

//Props
const props = withDefaults(defineProps<{
  branch?: string;
  path: string;
  repo?: string;
}>(), {
  branch: 'main'
});

//Refs
const themeLocale = useThemeLocaleData();

//Slash helpers
const removeTrailingSlash = text => text.replace(/\/$/, '');
const removeSurroundingSlashes = text => text.replace(/(^\/|\/$)/g, '');

//Computed
const sourceLink = computed(() =>
{
  //Get the repository
  const repo = props.repo ?? themeLocale.value.repo;

  //Generate the source link
  const sourceLink = `${removeTrailingSlash(repo)}/tree/${removeSurroundingSlashes(props.branch)}/${removeSurroundingSlashes(props.path)}`;

  return sourceLink;
});
</script>

<template>
  <a :href="sourceLink" rel="noopener noreferrer"><slot /></a>
</template>