<template>
  <div
    v-if="isMessageShown"
    class="message-box"
    :class="`message-box--${type}`"
  >
    <button
      type="button"
      class="message-box__close-btn"
      @click="isMessageShown = false"
    >
      <i class="mdi mdi-close message-box__close-icon" />
    </button>

    <h3 class="message-box__title">
      {{ title }}
    </h3>

    <p class="message-box__message">
      {{ message }}
    </p>

    <slot />
  </div>
</template>

<script>
const MESSAGE_TYPES = Object.freeze({
  success: 'success',
  warning: 'warning',
  error: 'error',
  info: 'info',
  danger: 'danger',
  default: 'default',
})

export default {
  name: 'message-box',

  props: {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: MESSAGE_TYPES.default,
      validator (value) {
        return Object.keys(MESSAGE_TYPES).includes(value)
      },
    },
  },

  data: _ => ({
    isMessageShown: true,
  }),
}
</script>

<style lang="scss">
@import '~@scss/variables';

.message-box {
  position: relative;
  padding: 1.6rem;
  font-size: 1.4rem;
  color: $col-message-box-text;
  line-height: 1.25;

  &--success { background-color: $col-success; }
  &--warning { background-color: $col-warning; }
  &--error { background-color: $col-error; }
  &--info { background-color: $col-info; }
  &--danger { background-color: $col-danger; }
  &--default { background-color: $col-message-box-text; }
}

.message-box__message {
  margin-top: 0.4rem;
  color: $col-message-box-text;
}

.message-box__close-btn {
  position: absolute;
  width: 2.4rem;
  height: 2.4rem;
  top: 0.4rem;
  right: 0.4rem;

  &:hover {
    opacity: 0.7;
    transition: opacity 0.2s;
  }
}

.message-box__close-icon {
  font-size: 1.8rem;

  &:before {
    font-weight: 700;
  }
}
</style>
