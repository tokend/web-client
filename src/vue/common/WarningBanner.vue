<template>
  <div :class="`warning-banner warning-banner--${messageType}`">
    <p class="warning-banner__message">
      {{ message }}
    </p>
    <slot />
  </div>
</template>

<script>
const MESSAGE_TYPES = {
  warning: 'warning',
  danger: 'danger',
}

export default {
  props: {
    message: { type: String, required: true },
    messageType: {
      type: String,
      required: true,
      validator (value) {
        return Object.keys(MESSAGE_TYPES).includes(value)
      },
    },
  },
}
</script>

<style lang="scss">
@import '~@scss/variables';

.warning-banner {
  min-height: 6rem;
  padding: 1.2rem 4.8rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &--warning {
    background-color: $bg-warning-lighter;
  }

  &--danger {
    background-color: $bg-warning;
  }
}

.warning-banner__message {
  font-size: 1.6rem;
  color: $col-status-msg-text;
}
</style>
