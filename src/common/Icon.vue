<template>
  <div class="icon">
    <template v-if="parsedIconName">
      <font-awesome-icon :icon="parsedIconName" />
    </template>
    <template v-else>
      <component
        v-bind="$attrs"
        :is="iconComponent"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import {
  PropType,
  defineAsyncComponent,
  defineComponent,
  ref,
} from 'vue'
import { ICON_NAMES } from '@/enums'

export default defineComponent({
  name: 'icon',
  components:{ FontAwesomeIcon },
  props: {
    name: {
      type: String as PropType<ICON_NAMES>,
      required: true,
    },
  },
  setup (props) {
    const parsedIconName = ref(null)
    let iconComponent

    try {
      parsedIconName.value = JSON.parse(props.name)
    } catch (error) {
      const path = `@/assets/icons/${props.name}-icon.vue`
      iconComponent = defineAsyncComponent({
        loader: () => import(/* @vite-ignore */ path),
      })
    }

    return {
      iconComponent,
      parsedIconName,
    }
  },
})
</script>

<style lang="scss" scoped>
.icon {
  display: grid;
  place-items: center;
}
</style>
