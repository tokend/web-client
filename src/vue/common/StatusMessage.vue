<template>
  <transition name="toggle">
    <div
      v-if="isShown"
      :class="`status-message status-message--${messageType}`"
    >
      <div class="status-message__wrp">
        <div class="status-message__content">
          <p class="status-message__title">
            {{
              messageTitleId | globalize({
                context: messageType
              })
            }}
          </p>
          <p class="status-message__text">
            {{
              messageId | globalize({
                context: messageType,
                ...messageArgs
              })
            }}
          </p>
        </div>
        <div class="status-message__btn-wrp">
          <button
            @click="isShown = false"
            class="status-message__btn"
          />
        </div>
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
    messageTitleId: '',
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
      this.messageTitleId = 'status-message.title'

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
  border-radius: 0.3rem;
  font-size: 1.6rem;
  position: fixed;
  right: 4rem;
  top: 4rem;
  z-index: $z-status-message;
  max-width: 42rem;
  min-width: 32rem;
  padding: 4rem 2.2rem 2rem 2.5rem;
  text-align: center;

  @include respond-to($tablet) {
    min-width: auto;
  }

  @include respond-to-custom($status-message-reposition-bp) {
    right: $content-side-paddings-sm;
    left: $content-side-paddings-sm;
  }

  @mixin apply-theme($col-main, $col-secondary) {
    box-shadow: 0.5rem 0.5rem 0.4rem -0.4rem rgba($col-main, .4);
    background: $col-secondary;
    &:before {
      content: '';
      position: absolute;
      top: 1.4rem;
      left: 0;
      width: 100%;
      height: 0.45rem;
      background-color: $col-main;
    }
    .status-message__wrp {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .status-message__content {
      min-width: 17rem;
      margin-right: 2rem;
    }
    p {
      font-size: 1.8rem;
      text-align: left;
      line-height: 1.3;
      padding: 0.6rem 0;
    }
    .status-message__title {
      font-size: 2.2rem;
      font-weight: bold;
      letter-spacing: 0.05rem;
      color: $col-main;
      &::first-letter {
        text-transform: uppercase;
      }
    }
    .status-message__btn {
      position: relative;
      width: 3.5rem;
      height: 3.5rem;
      background-color: $col-main;
      background: $col-main;
      border-radius: 0.2rem;
      color: $col-secondary;
      opacity: 0.85;
      box-shadow: 0.1rem 0.1rem rgba(0, 0, 0, 0.2);
      cursor: pointer;
      transition: 0.2s;
      &:hover {
        opacity: 1;
        box-shadow: 0.1rem 0.1rem 0.1rem rgba(0, 0, 0, 0.4);
      }
      &:before, &:after  {
        content: '';
        position: absolute;
        top: 0.8rem;
        left: 1.7rem;
        height: 2rem;
        width: 0.2rem;
        background-color: $col-secondary;
      }
      &:before {
      transform: rotate(45deg);
      }
      &:after {
      transform: rotate(-45deg);
      }
    }
  }

  &--warning {
    @include apply-theme($col-warning, $col-msg-warning);
  }
  &--success {
    @include apply-theme($col-success, $col-msg-success);
  }
  &--error {
    @include apply-theme($col-error, $col-msg-error);
  }
  &--info {
    @include apply-theme($col-info, $col-msg-info);
  }
}

.toggle-enter-active,
.toggle-leave-active {
  transition: all 0.2s linear;
}
.toggle-enter,
.toggle-leave-to {
  transform: rotateX(90deg);
  opacity: 0;
}
</style>
