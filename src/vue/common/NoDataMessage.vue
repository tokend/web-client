<template>
  <div class="no-data-message">
    <i v-if="iconName" :class="`mdi mdi-${iconName}`" />
    <h2>{{ titleId | globalize(titleIdKeys) }}</h2>
    <p>{{ messageId | globalize(messageIdKeys) }}</p>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'no-data-message',
  props: {
    iconName: { type: String, default: '' },
    titleId: { type: String, required: true },
    titleIdKeys: { type: Object, required: false, default: () => ({}) },
    messageId: { type: String, required: true },
    messageIdKeys: { type: Object, required: false, default: () => ({}) },
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
