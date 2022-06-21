<script setup lang="ts">
//Imports
import * as icons from 'lucide-vue-next';

//Props
const props = defineProps<{
  disabled?: boolean;
  icon: string;
  tag: string;
}>();

//Computed
const component = computed(() =>
{
  if (typeof props.icon != 'string')
  {
    throw new Error('Icon property must be a string!');
  }

  //Resolve the icon
  const icon = icons[props.icon as keyof typeof icons];
  if (icon == null)
  {
    throw new Error(`Unknown icon ${props.icon}!`);
  }

  //Get the SVG
  return icon;
});
</script>

<template>
  <component :is="props.tag">
    <component :is="component" />
  </component>
</template>