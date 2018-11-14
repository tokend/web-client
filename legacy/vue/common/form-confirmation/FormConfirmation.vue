<template>
  <transition name="form-confirmation__transition">
    <div class="form-confirmation">
      <p class="form-confirmation__msg">
        {{ message }}
      </p>
      <div class="form-confirmation__btns">
        <button
          class="form-confirmation__cancel-btn"
          @click.prevent="emitCancel"
          :disabled="pending">
          {{ cancelButton }}
        </button>
        <button
          class="form-confirmation__ok-btn"
          @click.prevent="emitOk"
          :disabled="pending">
          {{ okButton }}
        </button>
      </div>
    </div>
  </transition>
</template>

<script>
import { i18n } from 'L@/js/i18n'

export default {
  props: {
    message: {
      type: String,
      default () {
        return i18n.form_confirmation_default_message() || 'MESSAGE'
      }
    },
    okButton: {
      type: String,
      default () {
        return i18n.form_confirmation_default_ok_btn('OK_BUTTON') || 'OK_BUTTON'
      }
    },
    cancelButton: {
      type: String,
      default () {
        return i18n.form_confirmation_default_cancel_btn() || 'CANCEL_BUTTON'
      }
    },
    pending: {
      type: Boolean,
      default: false
    },
    animated: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      okEventName: 'ok',
      cancelEventName: 'cancel'
    }
  },
  methods: {
    emitOk () {
      this.$emit(this.okEventName)
    },
    emitCancel () {
      this.$emit(this.cancelEventName)
    }
  }
}
</script>

<style scoped lang="scss">
@import "~L@scss/variables.scss";
@import "~L@scss/mixins.scss";

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
  padding-right: 1 * $point;
}

.form-confirmation__btns {
  display: flex;
  max-width: 250px;
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
