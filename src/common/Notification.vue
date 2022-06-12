<template>
  <div class="notification">
    <icon class="notification__icon" :name="iconName" />
    <div class="notification__details">
      <h4 class="notification__title">
        {{ title }}
      </h4>
      <p class="notification__message">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Icon } from '@/common'

import { defineComponent, PropType } from 'vue'
import { ICON_NAMES } from '@/enums'

export default defineComponent({
  name: 'notification',
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
      default: ICON_NAMES.check,
    },
  },
  setup() {
    return {}
  },
})
</script>

<style lang="scss">
@import 'vue-toastification/src/scss/index';

.Vue-Toastification__toast {
  &--success {
    background: var(--success-main);
  }

  &--error {
    background: var(--error-main);
  }

  &--warning {
    background: var(--warning-main);
  }

  &--info {
    background: var(--info-main);
  }
}

.notification {
  display: grid;
  place-items: center;
  grid-template-columns: max-content 1fr;
  grid-gap: toRem(16);
}

.notification__icon {
  max-width: toRem(48);
  max-height: toRem(48);
}

.notification__details {
  display: grid;
  grid-gap: toRem(4);
  width: 100%;
}

.notification__title {
  color: var(--notification-title);
}

.notification__message {
  color: var(--notification-message-text);
}
</style>
