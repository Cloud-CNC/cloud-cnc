<script setup lang="ts">
//Imports
import logo from '~/ui/assets/logo.webp';
import {translateRoutes} from '~/ui/lib/menu-items';

//Events
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'openAbout'): void;
}>();

//Props
const props = defineProps<{
  modelValue: boolean;
}>();

//Compositions
const i18n = useI18n();

//Computed
const items = computed(() =>
{
  //Get the router
  const router = useRouter();

  //Get routes
  const routes = router.getRoutes();

  //Translate routes
  const items = translateRoutes(routes, i18n);

  return items;
});

const open = computed({
  get()
  {
    return props.modelValue;
  },
  set(value)
  {
    emit('update:modelValue', value);
  }
});
</script>

<template>
  <v-navigation-drawer v-model="open" app temporary>
    <v-list class="fill-height" nav density="compact">
      <!-- Logo -->
      <v-list-item>
        <v-container>
          <v-row align="center" class="brand" justify="space-around">
            <img alt="Cloud CNC logo" height="64" :src="logo">
            <h1>{{ $t('components.sidebar.title') }}</h1>
          </v-row>
        </v-container>
      </v-list-item>

      <!-- Route items -->
      <MenuItem v-for="item in items" :key="item.id" :item="item" />

      <!-- About -->
      <v-list-item class="about">
        <v-btn block color="info" variant="outlined" prepend-icon="Info" @click="emit('openAbout')">
          {{ $t('components.sidebar.about') }}
        </v-btn>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>
.about {
  bottom: 8px;
  left: 0;
  position: absolute;
  width: 100%;
}

.brand {
  height: 96px;
}
</style>