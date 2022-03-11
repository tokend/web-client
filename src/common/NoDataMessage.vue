<template>
  <div class="no-data-message">
    <icon class="no-data-message__icon" :name="$icons.folder" />
    <span class="no-data-message__message">
      {{ message }}
    </span>
  </div>
</template>

<script lang="ts">
import Icon from '@/common/Icon.vue'

import { defineComponent } from 'vue'

export default defineComponent({
  name: 'no-data-message',
  components: { Icon },
  props: {
    message: {
      type: String,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
.no-data-message {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.no-data-message__icon {
  color: var(--no-data-message-icon);
  font-size: toRem(48);
  margin-bottom: toRem(12);
}

.no-data-message__message {
  color: var(--no-data-message-message);
  font-size: toRem(18);
}
</style>
