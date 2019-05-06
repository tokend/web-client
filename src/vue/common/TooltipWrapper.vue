<template>
  <div class="tooltip-wrapper">
    <slot />
    <div
      class="tooltip-wrapper__message"
      :class="show ? 'tooltip-wrapper_show' : 'tooltip-wrapper_hidden'"
    >
      {{ message }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'tooltip-wrapper',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      default: '',
      require: true,
    },
  },
}
</script>

<style scoped lang="scss">
  @import '~@scss/variables';
  @import '~@scss/mixins';

  .tooltip-wrapper {
    position: relative;
    display: table;
  }

  .tooltip-wrapper .tooltip-wrapper__message {
    width: 10.2rem;
    background-color: $col-tooltip-wrapper-msg-bg;
    color: $col-tooltip-wrapper-msg-text;
    text-align: center;
    padding: 0.5rem 0;
    border-radius: 0.6rem;
    position: absolute;
    z-index: $z-tooltip-wrapper;
    left: 50%;
    bottom: -135%;
    margin-left: -5.4rem;
    transition: opacity 0.3s;
  }

  .tooltip-wrapper .tooltip-wrapper__message:after {
    content: '';
    position: absolute;
    bottom: 100%;
    left: 50%;
    margin-left: -0.5rem;
    border: 0.5rem solid;
    border-color: $col-tooltip-wrapper-border-style;
  }

  .tooltip-wrapper_hidden {
    visibility: hidden;
    opacity: 0;
  }

  .tooltip-wrapper_show {
    visibility: visible;
    opacity: 1;
  }
</style>
