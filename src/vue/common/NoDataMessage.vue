<template>
  <div class="no-data-message">
    <i v-if="iconName" :class="`mdi mdi-${iconName}`" />
    <h2>{{ title }}</h2>
    <p>{{ message }}</p>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'no-data-message',
  props: {
    iconName: { type: String, default: '' },
    title: { type: String, required: true },
    message: { type: String, required: true },
  },
}
</script>

<style lang="scss">
@import "~@scss/variables";
.no-data-message {
  text-align: center;
  max-width: 52rem;
  margin: 0 auto;
  padding: 0 .8rem;

  h2 {
    margin-bottom: .8rem;
    color: $col-no-data-message-text;
  }
  p {
    color: $col-no-data-message-description;
  }
  i {
    color: $col-no-data-message-icon-color;
    font-size: 6.4rem;
  }
}
</style>
