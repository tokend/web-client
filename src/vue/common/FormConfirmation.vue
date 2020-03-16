<template>
  <transition name="form-confirmation__transition">
    <div class="form-confirmation">
      <p class="form-confirmation__msg">
        {{ messageId | globalize }}
      </p>
      <div class="form-confirmation__btns">
        <button
          class="form-confirmation__cancel-btn app__button-flat"
          type="button"
          @click.prevent="emitCancel"
          :disabled="isPending || isDisabled">
          {{ cancelButtonTextId | globalize }}
        </button>
        <button
          type="submit"
          class="form-confirmation__ok-btn app__button-raised"
          :class="isDangerColor
            ? 'app__button-raised--danger'
            : 'app__button-raised'
          "
          @click.prevent="emitOk"
          :disabled="isPending || isDisabled">
          <template v-if="!isPending">
            {{ okButtonTextId | globalize }}
          </template>
          <template v-else>
            {{ 'form-confirmation.submit-processing' | globalize }}
          </template>
        </button>
      </div>
    </div>
  </transition>
</template>

<script>
const CONFIRMATION_DISABLED_TIME = 1000

export default {
  props: {
    messageId: {
      type: String,
      default: 'form-confirmation.message-text-default',
    },
    okButtonTextId: {
      type: String,
      default: 'form-confirmation.button-text-ok',
    },
    cancelButtonTextId: {
      type: String,
      default: 'form-confirmation.button-text-cancel',
    },
    isPending: {
      type: Boolean,
      default: false,
    },
    okEvent: {
      type: String,
      default: 'ok',
    },
    cancelEvent: {
      type: String,
      default: 'cancel',
    },
    isDangerColor: {
      type: Boolean,
      default: false,
    },
  },
  data: _ => ({
    isDisabled: false,
  }),
  created () {
    this.isDisabled = true

    setTimeout(() => {
      this.isDisabled = false
    }, CONFIRMATION_DISABLED_TIME)
  },
  methods: {
    emitOk () {
      this.$emit(this.okEvent)
    },
    emitCancel () {
      this.$emit(this.cancelEvent)
    },
  },
}
</script>

<style lang="scss">
@import '~@scss/variables.scss';
@import '~@scss/mixins.scss';

.form-confirmation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  flex: 1;
}

.form-confirmation__msg {
  font-size: 1.6rem;
  line-height: 1.25;
  padding-right: 1.6rem;
  color: $col-text;
}

.form-confirmation__btns {
  display: flex;
  max-width: 25rem;
  margin-left: auto;

  @media (max-width: $status-message-reposition-bp) {
    flex-direction: column;
  }
}

.form-confirmation__ok-btn {
  position: relative;
  height: 2.1rem;
}

.form-confirmation__cancel-btn {
  position: relative;
  height: 2.1rem;
}

.form-confirmation__ok-btn,
.form-confirmation__cancel-btn {
  flex: 0.5;

  &:not(:first-child) {
    margin-left: 0.5rem;

    @media (max-width: $status-message-reposition-bp) {
      margin-left: 0;
    }
  }
}

.form-confirmation__transition-enter-active {
  animation: form-confirmation__transition-keyframes 0.2s ease-in-out;
}

.form-confirmation__transition-leave-active {
  display: none;
  animation: form-confirmation__transition-keyframes 0s ease-in-out reverse;
}

@keyframes form-confirmation__transition-keyframes {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
