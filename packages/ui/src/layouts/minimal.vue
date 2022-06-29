<script setup lang="ts">
//Refs
const sidebarOpen = ref(false);
</script>

<template>
  <!-- Header -->
  <AppHeader collapse :show-nav-button="false" :show-route-title="false" @open-sidebar="sidebarOpen = true" />

  <!-- Content -->
  <v-main>
    <v-container class="fill-height" fluid>
      <router-view />
    </v-container>
  </v-main>
</template>