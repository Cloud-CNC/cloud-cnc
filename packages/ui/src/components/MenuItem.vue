<script setup lang="ts">
//Imports
import {MenuItemData} from '@/ui/lib/types';

//Props
const props = defineProps<{
  item: MenuItemData;
}>();
</script>

<template>
  <!-- Group -->
  <v-list-group v-if="props.item.type == 'group'">
    <template #activator="{props: templateProps}">
      <v-list-item v-bind="templateProps" :title="props.item.title" />
    </template>

    <!-- Children -->
    <div v-for="child in props.item.children" :key="child.id">
      <MenuItem :item="child" />
    </div>
  </v-list-group>

  <!-- Link -->
  <v-list-item v-else :to="props.item.path">
    <v-list-item-avatar start>
      <v-icon>{{ props.item.icon}}</v-icon>
    </v-list-item-avatar>
    <v-list-item-title>{{ props.item.title}}</v-list-item-title>
  </v-list-item>
</template>