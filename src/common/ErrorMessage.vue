<template>
  <div class="error-message">
    <icon class="error-message__icon" :name="iconName" />
    <h3 v-if="title" class="error-message__title">
      {{ title }}
    </h3>
    <p class="error-message__message">
      {{ message }}
    </p>
  </div>
</template>

<script lang="ts">
import { Icon } from '@/common'

import { ICON_NAMES } from '@/enums'
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'error-message',
  components: { Icon },
  props: {
    title: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      required: true,
    },
    iconName: {
      type: String as PropType<ICON_NAMES>,
      default: ICON_NAMES.exclamationCircle,
    },
  },
})
</script>

<style lang="scss" scoped>
.error-message {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.error-message__icon {
  color: var(--text-primary-main);
  font-size: toRem(48);
  margin-bottom: toRem(12);
}

.error-message__title {
  color: var(--text-primary-main);
  font-size: toRem(24);
}

.error-message__message {
  color: var(--text-primary-main);
  font-size: toRem(18);
}
</style>
