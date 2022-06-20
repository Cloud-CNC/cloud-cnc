<script setup lang="ts">
//Imports
import {generateLink} from '@/ui/lib/git';

//Data
const gitBranch = import.meta.env.GIT_BRANCH;
const gitCommit = import.meta.env.GIT_COMMIT;
const gitRemote = import.meta.env.GIT_REMOTE;
const git = {
  branch: gitBranch,
  commit: gitCommit.length > 8 ? gitCommit.substring(0, 7) : gitCommit,
  remote: gitRemote
};
const version = import.meta.env.VERSION;

//Computed
const gitLink = computed(() =>
{
  //Generate the link
  const link = generateLink(gitRemote, gitBranch, gitCommit);

  return link;
});

//Refs
const sidebarOpen = ref(false);
</script>

<template>
  <i-layout vertical>
    <!-- Sidebar -->
    <i-sidebar v-model="sidebarOpen" :collapse="true">
      <i-nav vertical>
        <i-nav-item class="logo-item" to="/">
          <img alt="Cloud CNC logo" class="logo" src="@/ui/assets/logo.webp">
        </i-nav-item>
        <i-nav-item :href="gitLink">
          <p>
            {{ $t('components.sidebar.version', {version}) }}
            <br>
            {{ $t('components.sidebar.git', git) }}
          </p>
        </i-nav-item>
      </i-nav>
    </i-sidebar>

    <!-- Page -->
    <i-layout>
      <!-- Header -->
      <i-layout-header>
        <i-navbar fluid>
          <i-hamburger-menu v-model="sidebarOpen" />
        </i-navbar>
      </i-layout-header>

      <!-- Content -->
      <i-layout-content>
        <router-view />
      </i-layout-content>

      <!-- Footer -->
      <i-layout-footer />
    </i-layout>
  </i-layout>
</template>

<style scoped>
.logo-item {
  ----item--background--hover: none;
}

.logo {
  width: 100%;
}
</style>