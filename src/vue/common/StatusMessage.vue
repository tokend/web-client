<template>
  <div v-if="isShown" :class="`status-message status-message--${messageType}`">
    <p class="status-message__content">
      {{
        messageId | globalize({
          context: messageType
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
  info: 'info'
})

export default {
  name: 'message',
  data: _ => ({
    messageId: '',
    messageType: '',
    isShown: false,
    timeoutId: null
  }),
  created () {
    Bus.on(Bus.eventList.success, message =>
      this.show(MESSAGE_TYPES.success, message))
    Bus.on(Bus.eventList.warning, message =>
      this.show(MESSAGE_TYPES.warning, message))
    Bus.on(Bus.eventList.error, message =>
      this.show(MESSAGE_TYPES.error, message))
    Bus.on(Bus.eventList.info, message =>
      this.show(MESSAGE_TYPES.info, message))
  },
  methods: {
    show (messageType, message) {
      this.messageType = messageType
      this.messageId = message || 'status-message.default-message'
      this.isShown = true

      if (this.timeoutId) {
        window.clearTimeout(this.timeoutId)
      }

      this.timeoutId = window.setTimeout(_ => {
        this.isShown = false
      }, CLOSE_TIMEOUT_MS)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";

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
  z-index: $status-message-z-index;

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
