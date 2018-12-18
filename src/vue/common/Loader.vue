<template>
  <div class="loader">
    <div class="loader__animation" />
    <div
      class="loader__message"
      v-if="message">
      {{ message }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'loader',
  props: {
    message: { type: String, default: '' }
  }
}
</script>

<style lang="scss">
  @import '@/scss/variables';

  .loader {
    display: flex;
    align-items: center;
  }

  .loader__message {
    color: $col-loader-text;
  }

  .loader__animation {
    width: 5 * $point;
    height: 5 * $point;
    border-radius: 50%;
    position: relative;
    margin-right: .5rem;

    &:after, &:before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      width: 3 * $point;
      height: 3 * $point;
      border: .5 * $point solid transparent;
      border-bottom: .5 * $point solid $col-loader-icon;
      border-radius: 50%;
      animation: rotate 1s linear infinite;
    }

    &:before {
      width: 4 * $point;
      height: 4 * $point;
      animation-direction: reverse;
    }
  }

  @keyframes rotate {
    from { transform: rotate(0deg) }
    to { transform: rotate(360deg) }
  }
</style>
