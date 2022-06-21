<route lang="yaml">
name: home
meta:
  public: false
  sidebar:
    hidden: false
    icon: Home
</route>

<template>
  <v-btn>{{ $t('meta.name') }}</v-btn>
  <v-icon>Activity</v-icon>
</template>