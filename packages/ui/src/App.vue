<template>
  <v-app>
    <suspense>
      <template #fallback>
        <v-progress-circular color="primary" indeterminate />
      </template>

      <router-view />
    </suspense>
  </v-app>
</template>

<style>
:root,
body,
#app {
  overflow: auto;
  height: 100%;
  width: 100%;
}
</style>