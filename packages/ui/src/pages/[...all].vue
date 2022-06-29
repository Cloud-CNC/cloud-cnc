<route lang="yaml">
name: unknown
meta:
  public: true
  sidebar:
    hidden: true
</route>

<template>
  <v-row align="center" class="fill-height">
    <v-col class="text-center">
      <h1 class="text-h1">
        {{ $t('routes.unknown.title') }}
      </h1>
      <h2 class="text-h3">
        {{ $t('routes.unknown.subtitle') }}
      </h2>
      <br>
      <v-btn color="primary" prepend-icon="Home" to="/">
        {{ $t('routes.unknown.home') }}
      </v-btn>
    </v-col>
  </v-row>
</template>