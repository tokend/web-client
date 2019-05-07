<template>
  <transition name="status-message__transition">
    <div
      v-if="isShown"
      :class="`status-message status-message--${messageType}`"
    >
      <div class="status-message__payload">
        <h4 class="status-message__title">
          {{ 'status-message.title' | globalize({ context: messageType }) }}
        </h4>

        <p class="status-message__text">
          {{ messageId | globalize({ context: messageType, ...messageArgs }) }}
        </p>
      </div>

      <button
        @click="isShown = false"
        class="status-message__close-btn"
      />
    </div>
  </transition>
</template>

<script>
import { Bus } from '@/js/helpers/event-bus'

const DEFAULT_MESSAGE_TRANSLATION_ID = 'status-message.default-message'
const CLOSE_TIMEOUT_MS = 10000
const MESSAGE_TYPES = Object.freeze({
  warning: 'warning',
  success: 'success',
  error: 'error',
  info: 'info',
})

export default {
  name: 'status-message',

  data: _ => ({
    messageTitleId: '',
    messageId: '',
    messageType: '',
    messageArgs: {},
    isShown: false,
    timeoutId: -1,
  }),

  created () {
    Bus.on(Bus.eventList.success, payload =>
      this.show(MESSAGE_TYPES.success, payload))
    Bus.on(Bus.eventList.warning, payload =>
      this.show(MESSAGE_TYPES.warning, payload))
    Bus.on(Bus.eventList.error, payload =>
      this.show(MESSAGE_TYPES.error, payload))
    Bus.on(Bus.eventList.info, payload =>
      this.show(MESSAGE_TYPES.info, payload))
  },

  methods: {
    show (messageType, payload) {
      this.messageType = messageType

      if (typeof payload === 'string') {
        this.messageId = payload
      } else if (this.isObject(payload)) {
        this.messageId = payload.messageId || DEFAULT_MESSAGE_TRANSLATION_ID
        this.messageArgs = payload.messageArgs || {}
      } else {
        this.messageId = DEFAULT_MESSAGE_TRANSLATION_ID
      }

      this.isShown = true

      if (this.timeoutId >= 0) {
        window.clearTimeout(this.timeoutId)
      }

      this.timeoutId = window.setTimeout(_ => {
        this.isShown = false
      }, CLOSE_TIMEOUT_MS)
    },

    isObject (value) {
      return typeof value === 'object' && !Array.isArray(value) && !null
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';
@import '~@scss/mixins';

$payload-padding: 2.4rem;

.status-message {
  @include box-shadow();
  position: fixed;
  right: 4rem;
  top: 4rem;
  z-index: $z-status-message;
  max-width: 42rem;
  min-width: 32rem;
  display: flex;

  &--warning {
    background-color: $col-status-msg-warning;
  }

  &--success {
    background-color: $col-status-msg-success;
  }

  &--error {
    background-color: $col-status-msg-error;
  }

  &--info {
    background-color: $col-status-msg-info;
  }

  @include respond-to($tablet) {
    min-width: auto;
  }
  @include respond-to-custom($status-message-reposition-bp) {
    right: $content-side-paddings-sm;
    left: $content-side-paddings-sm;
  }
}

.status-message__payload {
  padding: $payload-padding;
  flex: 1;
}

.status-message__text {
  font-size: 1.6rem;
  line-height: 1.25;
  color: $col-status-msg-text;
}

.status-message__title {
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 0.4rem;
  color: $col-status-msg-text;
}

.status-message__close-btn {
  position: relative;
  width: 4rem;
  align-self: stretch;
  background-color: transparent;
  display: block;

  &:hover {
    transition: 0.2s;
    background-color: $col-status-close-btn-hover;
  }

  /* cross */
  $cross-stroke-width: 0.2rem;
  $cross-stroke-height: 2rem;

  &:before,
  &:after {
    transition: 0.2s;

    content: '';
    position: absolute;
    height: $cross-stroke-height;
    width: $cross-stroke-width;
    top: $payload-padding - 0.2rem;
    // wait for 10.0.2 stylelint version
    /* stylelint-disable function-calc-no-invalid */
    left: calc(50% - (#{$cross-stroke-width} / 2));
    /* stylelint-enable function-calc-no-invalid */
    background-color: $col-button-raised-txt;
  }

  &:before {
    transform: rotate(45deg);
  }

  &:after {
    transform: rotate(-45deg);
  }

  &:hover:after,
  &:hover:before {
    transition: 0.2s;
    // wait for 10.0.2 stylelint version
    /* stylelint-disable function-calc-no-invalid */
    top: calc(50% - (#{$cross-stroke-height} / 2));
    /* stylelint-enable function-calc-no-invalid */
  }
  /* /cross */
}

.status-message__transition-enter-active,
.status-message__transition-leave-active {
  transition: all 0.2s linear;
}

.status-message__transition-enter,
.status-message__transition-leave-to {
  transform: rotateX(90deg);
  opacity: 0;
}
</style>
