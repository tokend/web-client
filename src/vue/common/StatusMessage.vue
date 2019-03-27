<template>
  <transition name="toggle">
    <div
      v-if="isShown"
      :class="`status-message status-message--${messageType}`"
    >
      <div class="status-message__content">
        <p class="status-message__text">
          {{
            messageId | globalize({
              context: messageType,
              ...messageArgs
            })
          }}
        </p>
      </div>
      <div
        class="status-message__btn-wrp"
        :class="`status-message__btn-wrp--${messageType}`"
      >
        <button
          @click="isShown = false"
          :class="`status-message__btn status-message__btn--${messageType}`"
        >
          {{
            "status-message.close-lbl" | globalize({
              context: messageType
            })
          }}
        </button>
      </div>
    </div>
  </transition>
</template>

<script>
import { Bus } from '@/js/helpers/event-bus'

const CLOSE_TIMEOUT_MS = 5000
const MESSAGE_TYPES = Object.freeze({
  warning: 'warning',
  success: 'success',
  error: 'error',
  info: 'info',
})

export default {
  name: 'status-message',
  data: _ => ({
    messageId: '',
    messageType: '',
    messageArgs: {},
    isShown: false,
    timeoutId: null,
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
      // eslint-disable-next-line
      } else if (typeof payload === 'object' && !Array.isArray(payload) && !null) {
        this.messageId = payload.messageId || 'status-message.default-message'
        this.messageArgs = payload.messageArgs || {}
      } else {
        this.messageId = 'status-message.default-message'
      }

      this.isShown = true

      if (this.timeoutId) {
        window.clearTimeout(this.timeoutId)
      }

      this.timeoutId = window.setTimeout(_ => {
        this.isShown = false
      }, CLOSE_TIMEOUT_MS)
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";
@import "~@scss/mixins";

.status-message {
  box-shadow:
    .6rem
    .6rem
    .6rem
    -.4rem
    $col-msg-shadow;
  border-radius: .3rem;
  font-size: 1.6rem;
  position: fixed;
  right: 4rem;
  top: 4rem;
  z-index: $z-status-message;
  max-width: 42rem;
  min-width: 32rem;
  text-align: center;
  opacity: .8;
  @include respond-to($tablet) {
    min-width: auto;
  }

  @include respond-to-custom($status-message-reposition-bp) {
    right: $content-side-paddings-sm;
    left: $content-side-paddings-sm;
    opacity: 1;
  }

  @mixin apply-theme ($col-bg, $col-bg-secondary, $col-msg) {
    background: $col-bg;
    background: linear-gradient($col-bg, $col-bg-secondary 25%);

    .status-message__text {
      color: $col-msg;
    }
  }

  &--warning {
    @include apply-theme($col-warning, $col-warning-secondary, $col-msg-warning)
  }
  &--success {
    @include apply-theme($col-success,$col-success-secondary,  $col-msg-success)
  }
  &--error {
    @include apply-theme($col-error,$col-error-secondary,  $col-msg-error)
  }
  &--info {
    @include apply-theme($col-info,$col-info-secondary,  $col-msg-info)
  }
}

  .status-message__content {
    position: relative;
    border-color: transparent;
    padding: 2rem 2rem 0.5rem;

    p {
      font-size: 1.8rem;
    }
  }

.status-message__text {
  margin: 2rem;
}

.status-message__btn-wrp {
  padding: .8rem;
  text-align: center;
  background-color: $col-msg-info;

  @mixin apply-theme ($col-bg, $col-border) {
    background-color: $col-bg;
    border: 0.01rem solid $col-border;
  }

  &--warning {
     @include apply-theme($col-msg-warning, $col-warning-secondary)
  }
  &--success {
     @include apply-theme($col-msg-success, $col-success-secondary)
  }
  &--error {
     @include apply-theme($col-msg-error, $col-error-secondary)
  }
  &--info {
     @include apply-theme($col-msg-info, $col-info-secondary)
  }
}

.status-message__btn {
  border-radius: .5rem;
  border-width: .1rem;
  border-style: solid;
  font-size: 1.6rem;
  padding: 1rem 2.9rem;
  cursor: pointer;
  transition: .2s;

  &:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }

  @mixin apply-theme ($col-main, $col-secondary) {
    background-color: $col-main;
    color: $col-secondary;
    border-color: $col-secondary;

    &:hover {
      color: $col-main;
      border-color: $col-secondary;
      background-color: $col-secondary;

    }
  }

  &--warning {
     @include apply-theme($col-msg-warning, $col-warning-secondary)
  }
  &--success {
     @include apply-theme($col-msg-success, $col-success-secondary)
  }
  &--error {
     @include apply-theme($col-msg-error, $col-error-secondary)
  }
  &--info {
     @include apply-theme($col-msg-info, $col-info-secondary)
  }
}

.toggle-enter-active, .toggle-leave-active {
  transition: all 0.2s linear;
}
.toggle-enter, .toggle-leave-to {
  transform: rotateX(90deg);
  opacity: 0;
}
</style>
