<template>
  <div class="no-data-message">
    <i
      v-if="iconName"
      :class="`mdi mdi-${iconName}`"
      class="no-data-message__icon"
    />
    <h2 class="no-data-message__title">
      {{ title }}
    </h2>
    <p class="no-data-message__message">
      {{ message }}
    </p>
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
@import '~@scss/variables';

.no-data-message {
  text-align: center;
  max-width: 52rem;
  margin: 0 auto;
  padding: 0 0.8rem;
}

.no-data-message__title {
  margin-bottom: 0.8rem;
  color: $col-no-data-message-text;
}

.no-data-message__message {
  color: $col-no-data-message-description;
}

.no-data-message__icon {
  color: $col-no-data-message-icon-color;
  font-size: 6.4rem;
}
</style>
