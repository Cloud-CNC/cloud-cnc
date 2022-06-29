<route lang="yaml">
name: licenses
meta:
  public: false
  sidebar:
    hidden: true
</route>

<script setup lang="ts">
//Imports
import getLicenses from '@/ui/lib/licenses';

//Get licenses
const licenses = await getLicenses();
</script>

<template>
  <v-card class="d-flex flex-column fill-height">
    <v-card-header>
      <v-card-header-text>
        <!-- Title -->
        <v-card-title>
          {{ $t('routes.licenses.title') }}
        </v-card-title>
      </v-card-header-text>
    </v-card-header>

    <!-- Licenses -->
    <v-card-text class="licenses-container overflow-auto ma-4">
      <pre class="licenses"><code>{{ licenses }}</code></pre>
    </v-card-text>

    <!-- Actions -->
    <v-card-actions>
      <v-btn block color="info" href="/licenses.txt" prepend-icon="FileText" rel="noopener noreferrer" target="_blank" tag="a" variant="outlined">
        {{ $t('routes.licenses.raw') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.licenses {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: fit-content;
  width: fit-content;
}

.licenses-container {
  position: relative;
}
</style>