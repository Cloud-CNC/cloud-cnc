<script setup lang="ts">
//Refs
const aboutVisible = ref(false);
const sidebarOpen = ref(false);
</script>

<template>
  <!-- About dialog -->
  <AboutDialog v-model="aboutVisible" />

  <!-- Sidebar -->
  <AppSidebar v-model="sidebarOpen" @open-about="aboutVisible = true" />

  <!-- Header -->
  <AppHeader @open-sidebar="sidebarOpen = true" />

  <!-- Content -->
  <v-main>
    <v-container class="fill-height" fluid>
      <router-view />
    </v-container>
  </v-main>
</template>