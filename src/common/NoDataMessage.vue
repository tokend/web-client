<template>
  <div class="no-data-message">
    <icon class="no-data-message__icon" :name="iconName" />
    <span class="no-data-message__message">
      {{ message }}
    </span>
  </div>
</template>

<script lang="ts">
import { Icon } from '@/common'

import { defineComponent, PropType } from 'vue'
import { ICON_NAMES } from '@/enums'

export default defineComponent({
  name: 'no-data-message',
  components: { Icon },
  props: {
    iconName: {
      type: String as PropType<ICON_NAMES>,
      default: ICON_NAMES.archive,
    },
    message: {
      type: String,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
.no-data-message {
  display: grid;
  place-items: center;
  grid-gap: toRem(12);
}

.no-data-message__icon {
  color: var(--text-primary-light);
  font-size: toRem(48);
}

.no-data-message__message {
  color: var(--text-primary-light);
  font-size: toRem(18);
}
</style>
