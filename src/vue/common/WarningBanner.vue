<template>
  <div
    :class="`warning-banner warning-banner--${messageType}`">
    <p class="warning-banner__message">
      {{ messageId | globalize({ reason: messageArgs }) }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    messageId: { type: String, required: true },
    messageType: { type: String, default: 'warning' },
    messageArgs: { type: String, default: '' },
  },
}
</script>

<style lang="scss">
@import '~@scss/variables';

.warning-banner {
  min-height: 8rem;
  padding: 1.2rem 4.8rem;
  font-size: 1.6rem;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;

  &--warning {
    background-color: $col-warning;
  }

  &--danger {
    background-color: $col-danger;
  }
}

.warning-banner__message-link {
  color: #fff;
  cursor: pointer;
  text-decoration: underline;
  text-align: center;

  &:hover { color: #fff }
}
</style>
