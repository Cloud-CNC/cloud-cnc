<route lang="yaml">
name: dashboard
meta:
  public: false
  sidebar:
    hidden: false
    icon: LayoutDashboard
</route>

<template>
  <v-btn>{{ $t('meta.name') }}</v-btn>
  <v-icon>Activity</v-icon>
</template>