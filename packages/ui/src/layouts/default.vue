<script setup lang="ts">
//Refs
const aboutVisible = ref(false);
const sidebarOpen = ref(false);
</script>

<template>
  <AboutDialog v-model="aboutVisible" />

  <AppSidebar v-model="sidebarOpen" @open-about="aboutVisible = true" />

  <AppHeader @open-sidebar="sidebarOpen = true" />

  <!-- Content -->
  <v-main>
    <v-container fluid>
      <router-view />
    </v-container>
  </v-main>
</template>