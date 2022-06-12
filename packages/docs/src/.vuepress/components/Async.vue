<script setup lang="ts">
//Imports
import '@asyncapi/web-component/lib/asyncapi-web-component';
import AsyncCSS from '@asyncapi/react-component/lib/styles/fiori.css';

//Props
const props = defineProps<{
  url: string;
}>();

//Convert the CSS to a data URL
const styleURL = URL.createObjectURL(new Blob([AsyncCSS]));
</script>

<template>
  <asyncapi-component :schemaUrl="props.url" :cssImportPath="styleURL" />
</template>