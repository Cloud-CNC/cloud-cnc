<script setup lang="ts">
//Imports
import SwaggerCSS from 'swagger-ui/dist/swagger-ui.css';
import SwaggerUI from 'swagger-ui';
import {ShadowRoot, ShadowStyle} from 'vue-shadow-dom';
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
  //Initialize Swagger
  SwaggerUI({
    deepLinking: true,
    displayOperationId: true,
    domNode: element.value,
    layout: 'BaseLayout',
    showExtensions: true,
    syntaxHighlight: {theme: 'nord'},
    tryItOutEnabled: false,
    url: props.url,
    validatorUrl: 'none'
  });
});
</script>

<template>
  <shadow-root class="container">
    <shadow-style>{{ SwaggerCSS}}</shadow-style>
    <div ref="element"></div>
  </shadow-root>
</template>

<style>
.container {
  background-color: white;
}
</style>