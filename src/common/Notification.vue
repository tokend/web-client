<template>
  <div class="notification">
    <icon
      class="notification__icon"
      :name="iconName"
    />
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
import Icon from '@/common/Icon.vue'

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
  setup () {
    return {}
  },
})
</script>

<style lang="scss">
@import 'vue-toastification/src/scss/variables';

@import 'vue-toastification/src/scss/toastContainer';

@import 'vue-toastification/src/scss/toast';

@import 'vue-toastification/src/scss/closeButton';

@import 'vue-toastification/src/scss/progressBar';

@import 'vue-toastification/src/scss/animations/bounce';

.Vue-Toastification__toast {

  &--success {
    background: var(--notification-bg-success);
  }

  &--error {
    background: var(--notification-bg-error);
  }

  &--warning {
    background: var(--notification-bg-warning);
  }

  &--info {
    background: var(--notification-bg-info);
  }
}

.notification {
  display: grid;
  grid-template-columns: max-content 5fr;
  grid-gap: toRem(16);
}

.notification__icon {
  display: grid;
  place-items: center;
  font-size: toRem(28);
}

.notification__details {
  display: grid;
  grid-gap: toRem(4);
}

.notification__title {
  color: var(--notification-title);
}

</style>
