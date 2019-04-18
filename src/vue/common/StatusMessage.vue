<template>
  <div v-if="isShown" :class="`status-message status-message--${messageType}`">
    <p class="status-message__content">
      {{
        messageId | globalize({
          context: messageType,
          ...messageArgs
        })
      }}
    </p>
    <div class="status-message__btn-wrp">
      <button class="status-message__btn" @click="isShown = false">
        {{
          "status-message.close-lbl" | globalize({
            context: messageType
          })
        }}
      </button>
    </div>
  </div>
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
  padding: 2rem 4rem;
  position: fixed;
  right: 4rem;
  top: 4rem;
  z-index: $z-status-message;
  max-width: 42rem;

  @include respond-to-custom($status-message-reposition-bp) {
    right: $content-side-paddings-sm;
    left: $content-side-paddings-sm;
    padding: 2rem;
  }

  @mixin apply-theme ($col-msg-background, $col-msg-text) {
    background: $col-msg-background;

    .status-message__content,
    .status-message__btn {
      color: $col-msg-text;
    }
    .status-message__btn {
      border: .1rem solid $col-msg-text;
    }
  }

  &--warning { @include apply-theme($col-warning, $col-text-msg-warning) }
  &--success { @include apply-theme($col-success, $col-text-msg-success) }
  &--error { @include apply-theme($col-error, $col-text-msg-error) }
  &--info { @include apply-theme($col-info, $col-text-msg-info) }
}

.status-message__content {
  margin-bottom: 2.5rem;
}

.status-message__btn-wrp {
  text-align: center;
}

.status-message__btn {
  background: transparent;
  border-radius: .5rem;
  font-size: 1.4rem;
  padding: .5rem 2rem;
  cursor: pointer;
  transition: .2s;

  &:hover { opacity: .75 }
}
</style>
