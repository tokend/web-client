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
    .6 * $point
    .6 * $point
    .6 * $point
    -.4 * $point
    $col-status-msg-shadow;
  border-radius: .3 * $point;
  font-size: 1.6 * $point;
  padding: 2 * $point 4 * $point;
  position: fixed;
  right: 4 * $point;
  top: 4 * $point;

  &--warning { background: $col-warning }
  &--success { background: $col-success }
  &--error { background: $col-error }
  &--info { background: $col-info }
}

.status-message__content,
.status-message__btn {
  color: $col-text-status-message;
}

.status-message__content {
  margin-bottom: 2.5 * $point;
}

.status-message__btn-wrp {
  text-align: center;
}

.status-message__btn {
  background: transparent;
  border-radius: .5 * $point;
  border: .1 * $point solid $col-text-status-message;
  font-size: 1.4 * $point;
  padding: .5 * $point 2 * $point;
  cursor: pointer;
  transition: .2s;

  &:hover { opacity: .75 }
}
</style>
