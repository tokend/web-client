<template>
  <div class="warning-banner">
    <p class="warning-banner__message">
      {{ message }}
      <router-link
        class="warning-banner__message-link"
        :to="{ name: 'supported-browsers' }">
        Read more
      </router-link>
    </p>
  </div>
</template>

<script>
export default {
  name: 'warning-banner',
  props: {
    message: { type: String, required: true }
  }
}
</script>

<style lang="scss">
@import "~L@scss/variables";

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
  // "important" here to rewrite the material design theme styles
  color: #fff !important;
  text-decoration: underline !important;
  cursor: pointer;

  &:hover {
    color: #fff;
  }
}
</style>
