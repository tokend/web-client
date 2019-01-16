<template>
  <transition name="form-confirmation__transition">
    <div class="form-confirmation">
      <p class="form-confirmation__msg">
        {{ messageId | globalize }}
      </p>
      <div class="form-confirmation__btns">
        <button
          class="form-confirmation__cancel-btn"
          @click.prevent="emitCancel"
          :disabled="isPending">
          {{ cancelButtonTextId | globalize }}
        </button>
        <button
          class="form-confirmation__ok-btn"
          @click.prevent="emitOk"
          :disabled="isPending">
          {{ okButtonTextId | globalize }}
        </button>
      </div>
    </div>
  </transition>
</template>

<script>
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
@import "~@scss/variables.scss";
@import "~@scss/mixins.scss";

.form-confirmation {
  display: flex;
  justify-content: space-between;
  width: 100%;
  flex: 1;
}

.form-confirmation__msg,
.form-confirmation__btns {
  width: 49.999999%;
  flex: 0.5;
}

.form-confirmation__msg {
  font-size: 1rem;
  line-height: 1.25;
  padding-right: 1rem;
}

.form-confirmation__btns {
  display: flex;
  max-width: 25rem;
}

.form-confirmation__ok-btn,
.form-confirmation__cancel-btn {
  flex: 0.5;

  &:not(:first-child) {
    margin-left: 0.5rem;
  }
}

.form-confirmation__ok-btn {
  @include button-raised();
  position: relative;
  height: 2.1rem;
}

.form-confirmation__cancel-btn {
  @include button-flat();
  position: relative;
  height: 2.1rem;
}

.form-confirmation__transition-enter-active {
  animation: form-confirmation__transition-keyframes 0.2s ease-in-out;
}

.form-confirmation__transition-leave-active {
  display: none;
  animation: form-confirmation__transition-keyframes 0s ease-in-out reverse;
}

@keyframes form-confirmation__transition-keyframes {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
