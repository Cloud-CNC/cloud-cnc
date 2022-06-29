<script setup lang="ts">
import {VNode} from 'vue';
import {cloneDeep, merge} from 'lodash-es';

//Events
const emit = defineEmits<(e: 'wormholeContent', hasContent: boolean) => void>();

//Props
const props = defineProps<{
  name: string;
  slotProps?: any;
}>();

//Slots
const slots = useSlots();

//Compositions
const {wormhole, deleteWormhole} = useWhiteHole(props.name);

//Computed
const node = computed(() =>
{
  //Get the content
  let content = [] as VNode[];

  //Wormhole content
  if (wormhole.value != null && wormhole.value?.blackHoles.length > 0)
  {
    //Execute black hole slots
    for (const blackHole of wormhole.value.blackHoles)
    {
      //Skip the black hole if has no content
      if (blackHole.value.slot == null)
      {
        continue;
      }

      /**
       * Clone and merge slot props
       * 
       * Note: cloning is necessary to prevent black holes in the same wormhole from interfering
       * with each other
       */
      const slotProps = merge(cloneDeep(props.slotProps), cloneDeep(blackHole.value.props ?? {}));

      //Execute the slot
      content.push(...blackHole.value.slot(slotProps));
    }
  }
  //Fallback content
  else if (slots.default != null)
  {
    //Execute the slot
    content = slots.default(props.slotProps);
  }

  //Wrap the content
  if (slots['white-hole'] != null)
  {
    //Execute the white hole slot
    const nodes = slots['white-hole']();

    //Update content
    content = content.flatMap(contentNode =>
      nodes.map(whiteHoleNode =>
        (whiteHoleNode.type == 'template' && whiteHoleNode.props?.['white-hole-slot'] != null) ? contentNode : whiteHoleNode)
    );
  }

  //Render
  return h('div', null, content);
});

//Watchers
watchEffect(() =>
{
  //Emit the wormhole content status
  emit('wormholeContent', wormhole.value != null && wormhole.value?.blackHoles.length > 0);
});

//Hooks
onBeforeUnmount(deleteWormhole);
</script>

<template>
  <node />
</template>