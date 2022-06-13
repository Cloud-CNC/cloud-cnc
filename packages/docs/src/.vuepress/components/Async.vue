<script setup lang="ts">
//Imports
import '@asyncapi/react-component/styles/default.css';
import AsyncUI from '@asyncapi/react-component/browser/standalone';
import {AsyncApiProps} from '@asyncapi/react-component';
import {onMounted, ref} from 'vue';

//Props
const props = defineProps<{
  url: string;
}>();

//Refs
const element = ref();

//Handlers
onMounted(() =>
{
  //Initialize Async
  AsyncUI.render({
    schema: {
      url: props.url
    }
  } as AsyncApiProps, element.value);
});
</script>

<template>
  <div class="asyncapi" ref="element"></div>
</template>

<style>
.asyncapi code {
  color: initial !important;
}
</style>