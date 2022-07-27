<script setup lang="ts">
//Imports
import {VTextField} from 'vuetify/components';
import {generateHighlights} from '~/ui/lib/search';
import {useThemeStore} from '~/ui/stores/user';

//Events
const emit = defineEmits<(e: 'update:modelValue', value: string) => void>();

//Props
const props = defineProps<{
  modelValue: string;
}>();

//Refs
const query = ref('');
const fieldElement = ref<VTextField>();
const column = ref(1);

//Compositions
const theme = useThemeStore();

//Computed
const caretColor = computed(() => window.getComputedStyle(document.documentElement).caretColor);
const fuzzyColor = computed(() => theme.dark ? '#bdbdbd' : '#424242');
const highlights = computed(() => generateHighlights(query.value));
const inputElement = computed<HTMLInputElement | undefined>(() => fieldElement.value?.$el.querySelector('input'));
const highlightsContainerElement = computed<HTMLDivElement | undefined>(() => fieldElement.value?.$el.querySelector('.highlights'));

//More compositions
const highlightsContainerBounding = useElementBounding(highlightsContainerElement);

//More computed
const searchStyles = computed(() => ({
  height: `${highlightsContainerBounding.height.value}px`,
  width: `${highlightsContainerBounding.width.value}px`
} as CSSStyleDeclaration));

//Effects
watchEffect(() =>
{
  //Update the query
  query.value = props.modelValue;
});

watchEffect(() =>
{
  //Update the query to the simplified text
  query.value = highlights.value[0];
});

//Methods
const updateColumn = () => window.setTimeout(() =>
{
  //Update the position
  switch (inputElement.value?.selectionDirection)
  {
    case 'forward':
      column.value = (inputElement.value?.selectionEnd ?? NaN) + 1;
      break;

    case 'backward':
      column.value = (inputElement.value?.selectionStart ?? NaN) + 1;
      break;

    default:
      column.value = NaN;
      break;
  }
}, 0);
</script>

<template>
  <!-- Input -->
  <v-text-field
    ref="fieldElement" class="search-input" :model-value="query" :label="$t('components.search.query')"
    append-icon="Search" :rules="[() => highlights[2] || $t('components.search.invalid')]" :hide-details="false"
    @keydown="updateColumn" @click="updateColumn" @select="updateColumn" @input="updateColumn"
    @update:model-value="event => emit('update:modelValue', event)"
  >
    <template #default>
      <!-- Syntax highlights -->
      <div class="d-flex align-center highlights">
        <component :is="highlight" v-for="highlight in highlights[1]" :key="highlight" />
      </div>
    </template>

    <!-- Position -->
    <template #details>
      <p>{{ $t('components.search.position', {column}) }}</p>
    </template>
  </v-text-field>
</template>

<style scoped>
.highlights {
  font-family: monospace;
  pointer-events: none;
  white-space: pre;
}
</style>

<style>
.highlights .character,
.highlights .keyword {
  color: #304fff;
}

.highlights .fuzzy {
  color: v-bind('fuzzyColor');
}

.highlights .literal {
  color: #2196f3;
}

.search-input .v-field__input {
  position: relative;
  overflow-x: auto;
}

.search-input input[type="text"] {
  color: transparent;
  caret-color: v-bind('caretColor');
  font-family: monospace;
  position: absolute;
  height: v-bind('searchStyles.height');
  width: v-bind('searchStyles.width');
}

.search-input input[type="text"]::selection {
  color: transparent;
  background: auto;
}
</style>