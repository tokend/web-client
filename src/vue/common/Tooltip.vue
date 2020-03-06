<template>
  <div class="tooltip">
    <span class="tooltip__wrapper">
      <slot />

      <span
        class="tooltip__wrapper-box"
        :class="{
          [`tooltip__wrapper-box--${TYPES[type]}`]: type,
          'tooltip__wrapper-box--show': show,
          'tooltip__wrapper-box--hide': !show
        }"
      >
        <span
          class="tooltip__wrapper-text"
          :class="`tooltip__wrapper-text--${TYPES[type]}`"
        >
          {{ message }}
        </span>
      </span>
    </span>
  </div>
</template>

<script>
const TYPES = {
  tfaClipboard: 'tfa-clipboard',
  default: 'default',
}

export default {
  name: 'tooltip',
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
    type: {
      type: String,
      default: 'default',
    },
  },
  data: _ => ({
    TYPES,
  }),
}
</script>

<style scoped lang="scss">
@import '~@scss/variables';
@import '~@scss/mixins';

.tooltip {
  overflow: hidden;
  margin: auto;
  display: inline;
  text-align: center;
}

.tooltip__wrapper {
  display: inline;
}

.tooltip__wrapper-box {
  position: absolute;
  visibility: hidden;

  &--tfa-clipboard {
    right: -5%;
  }
}

.tooltip__wrapper-text {
  display: block;
  position: relative;
  top: 0.5rem;
  width: 10rem;
  padding: 0.1rem 0;
  color: $col-tooltip-wrapper-msg-text;
  background: $col-tooltip-wrapper-msg-bg;
  text-align: center;
  border-radius: 0.6rem;
  transition: opacity 0.3s;
  z-index: $z-tooltip-wrapper;

  &:after {
    content: '';
    position: absolute;
    bottom: 100%;
    left: 50%;
    margin-left: -0.45rem;
    width: 0;
    height: 0;
    border-bottom: 0.7rem solid $col-tooltip-wrapper-msg-bg;
    border-right: 0.7rem solid transparent;
    border-left: 0.7rem solid transparent;
  }

  &--default {
    right: 50%;
  }

  &--tfa-clipboard {
    right: 0;
  }
}

.tooltip__wrapper-box--hide {
  visibility: hidden;
  opacity: 0;
}

.tooltip__wrapper-box--show {
  visibility: visible;
  opacity: 0.7;
}
</style>
