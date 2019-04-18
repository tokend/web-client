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
    messageId: { type: String, required: true },
  },
}
</script>

<style lang="scss">
.warning-banner {
  min-height: 8rem;
  padding: 1.6rem 4.8rem;
  background-color: $col-warning;
  font-size: 1.6rem;
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
