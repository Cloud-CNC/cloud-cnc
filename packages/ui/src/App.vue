<script setup lang="ts">
//Imports
import '~/ui/styles/index.css';
</script>

<template>
  <v-app>
    <suspense>
      <!-- Loading -->
      <template #fallback>
        <v-progress-circular color="primary" indeterminate />
      </template>

      <!-- Page -->
      <router-view />
    </suspense>
  </v-app>
</template>