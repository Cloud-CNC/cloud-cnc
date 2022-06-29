<script setup lang="ts">
//Imports
import {BlackHole} from '@/ui/composables/wormhole';

//Props
const props = defineProps<{
  name: string;
  slotProps?: any;
}>();

//Slots
const slots = useSlots();

//Refs
const cacheKey = ref(0);
const blackHole = computed(() => ({
  cacheKey: cacheKey.value,
  props: props.slotProps,
  slot: slots.default
} as BlackHole));

//More compositions
const {deleteBlackHole} = useBlackHole(props.name, blackHole);

//Hooks
/**
 * Manually invalidate the computed black hole because watching slots isn't supported
 */
onUpdated(() => cacheKey.value++);
onBeforeUnmount(deleteBlackHole);
</script>

<template>
  <span />
</template>