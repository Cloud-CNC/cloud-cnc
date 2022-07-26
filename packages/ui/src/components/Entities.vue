<script setup lang="ts">
//Imports

//Types
enum Mode
{
  CARD = 'card',
  TABLE = 'table'
}

//Props
const props = defineProps<{
  title: string;
  icon: string;
  entities: any[];
}>();

//Refs
const cardMode = ref(false);
const page = ref(1);
const limit = ref(25);
const query = ref('');
</script>

<template>
  <v-card :title="props.title" :prepend-icon="props.icon">
    <v-card-text>
      <v-container>
        <!-- Top bar -->
        <v-row>
          <!-- Search -->
          <Search v-model="query" />

          <!-- Toggle mode -->
          <template #append>
            <v-btn color="info" :icon="cardMode ? 'Table' : 'LayoutGrid'" @click="cardMode = !cardMode" />
          </template>
        </v-row>

        <!-- Entities -->
        <v-row>
          <!-- Card mode -->
          <div v-if="cardMode" />

          <!-- Table mode -->
          <v-table v-else fixed-header>
            <!-- Table head -->
            <thead>
              <tr>
                <th>

                </th>
              </tr>
            </thead>

            <!-- Table body -->
            <tbody>
              <tr>

              </tr>
            </tbody>

            <!-- Table footer -->
            <tfoot>
              <tr></tr>
            </tfoot>
          </v-table>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>