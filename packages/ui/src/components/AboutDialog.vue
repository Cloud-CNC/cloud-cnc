<script setup lang="ts">
//Imports
import {generateLink} from '@/ui/lib/git';

//Events
const emit = defineEmits<(e: 'update:modelValue', value: boolean) => void>();

//Props
const props = defineProps<{
  modelValue: boolean;
}>();

//Compositions
const i18n = useI18n();

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
const items = [
  {
    title: i18n.t('components.about.items.version.key'),
    subtitle: i18n.t('components.about.items.version.value', {version})
  },
  {
    title: i18n.t('components.about.items.commit.key'),
    subtitle: i18n.t('components.about.items.commit.value', git),
    href: generateLink(gitRemote, gitBranch, gitCommit)
  },
  {
    title: i18n.t('components.about.items.documentation.key'),
    subtitle: i18n.t('components.about.items.documentation.value'),
    href: i18n.t('components.about.items.documentation.value')
  },
  {
    title: i18n.t('components.about.items.licenses'),
    to: '/licenses'
  }
];

//Computed
const visible = computed({
  get()
  {
    return props.modelValue;
  },
  set(value)
  {
    emit('update:modelValue', value);
  }
});

//Methods
const copyDebugInformation = async () =>
{
  //Aggregate information
  const info = JSON.stringify({
    version,
    git
  }, null, 2);

  //Copy
  await navigator.clipboard.writeText(info);
};

const generateProps = (href?: string, to?: string) =>
{
  let props = {};

  //External link
  if (href != null)
  {
    props= {
      href,
      rel: 'noopener noreferrer',
      tag: 'a',
      target: '_blank'
    };
  }
  //Internal link
  else if (to != null)
  {
    props = {
      onClick: () => visible.value = false,
      to
    };
  }
  
  return props;
};
</script>

<template>
  <v-dialog v-model="visible">
    <v-card prepend-icon="Info" width="400px">
      <!-- Title -->
      <template #title>
        {{ $t('components.about.title') }}
      </template>

      <!-- Items -->
      <div v-for="item in items" :key="item.title">
        <v-list-item class="reset-overlay-opacity" :title="item.title" :subtitle="item.subtitle" v-bind="generateProps(item.href, item.to)" />
      </div>

      <!-- Actions -->
      <v-card-actions>
        <!-- Copy debug information -->
        <v-btn prepend-icon="Copy" color="info" @click="copyDebugInformation">
          {{ $t('components.about.actions.copy') }}
        </v-btn>

        <v-spacer />

        <!-- Close -->
        <v-btn prepend-icon="XCircle" color="error" @click="visible = false">
          {{ $t('components.about.actions.close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style>
.reset-overlay-opacity > .v-list-item__overlay {
  opacity: 0;
}
</style>