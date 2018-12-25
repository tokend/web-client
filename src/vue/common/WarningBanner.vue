<template>
  <div class="warning-banner">
    <p class="warning-banner__message">
      {{ messageId | globalize }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    messageId: { type: String, required: true }
  }
}
</script>

<style lang="scss">
@import '~@scss/variables';

.warning-banner {
  min-height: 8 * $point;
  padding: 1.6 * $point 4.8 * $point;
  background-color: $col-warning;
  font-size: 1.6 * $point;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.warning-banner__message-link {
  color: #fff;
  cursor: pointer;
  text-decoration: underline;

  &:hover { color: #fff }
}
</style>
