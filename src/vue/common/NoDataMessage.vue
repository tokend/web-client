<template>
  <div class="no-data-message">
    <i v-if="iconName" :class="`mdi mdi-${iconName}`" />
    <h2>{{ msgTitle }}</h2>
    <p>{{ msgMessage }}</p>
  </div>
</template>

<script>
export default {
  name: 'no-data-message',
  props: {
    iconName: { type: String, default: '' },
    msgTitle: { type: String, required: true },
    msgMessage: { type: String, required: true }
  }
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
  }
}
</style>
