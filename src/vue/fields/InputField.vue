<template>
  <div
    class="input-field"
    :class="{
      'input-field--error': errorMessage,
      'input-field--monospaced': monospaced,
      'input-field--readonly': $attrs.readonly || $attrs.readonly === '',
      'input-field--disabled': $attrs.disabled,
      'input-field--pwd-toggle-present': isPasswordType,
      'input-field--phone-number': isPhoneNumberType,
      'input-field--telegram': isTelegramType,
    }"
  >
    <input
      v-bind="$attrs"
      v-on="listeners"
      class="input-field__input"
      :class="{
        'input-field__input--autofill-white': whiteAutofill,
        'input-field__padding-input': (isPhoneNumberType || isTelegramType),
      }"
      :type="isPasswordType && isPasswordShown ? 'text' : type"
      :value="value"
      :placeholder="$attrs.placeholder || ' '"
      :tabindex="$attrs.readonly || $attrs.readonly === ''
        ? -1
        : $attrs.tabindex"
      @focus="onFocus"
      @blur="onBlur"
    >

    <button
      v-if="isPasswordType"
      type="button"
      class="input-field__password-toggle"
      :class="{
        'input-field__password-toggle--autofill-white': whiteAutofill
      }"
      tabindex="-1"
      @click="isPasswordShown = !isPasswordShown"
    >
      <i
        class="mdi input-field__password-toggle-icon"
        :class="isPasswordShown ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
      />
    </button>

    <span
      class="input-field__label"
      :class="{
        'input-field__label--icon': (isPhoneNumberType || isTelegramType),
      }"
    >
      {{ label }}

      <template v-if="isCapsLockOn">
        ({{ 'input-field.caps-lock-warning' | globalize }})
      </template>
    </span>

    <transition name="input-field__err-transition">
      <p v-if="errorMessage" class="input-field__err-mes">
        {{ errorMessage }}
      </p>
    </transition>
  </div>
</template>

<script>
import { MathUtil } from '@/js/utils'

const EVENTS = {
  input: 'input',
}

const INPUT_TYPES = {
  telegram: 'telegram',
  phoneNumber: 'phone-number',
  password: 'password',
  number: 'number',
}

export default {
  props: {
    label: { type: String, default: 'Label' },
    value: { type: [String, Number], default: undefined },
    monospaced: { type: Boolean, default: false },
    errorMessage: { type: String, default: undefined },
    whiteAutofill: { type: Boolean, default: true },
    type: { type: String, default: undefined },
  },

  data: () => ({
    isCapsLockOn: false,
    isPasswordShown: false,
  }),

  computed: {
    listeners () {
      return {
        ...this.$listeners,
        input: event => {
          this.normalizeTargetValue(event.target)
          if (this.value === event.target.value) return
          this.$emit(EVENTS.input, event.target.value)
        },
      }
    },

    isPasswordType () {
      return this.type === INPUT_TYPES.password
    },

    isPhoneNumberType () {
      return this.type === INPUT_TYPES.phoneNumber
    },

    isTelegramType () {
      return this.type === INPUT_TYPES.telegram
    },
  },

  methods: {
    onInput (event) {},
    onFocus (event) {
      if (this.isPasswordType) {
        /**
         * Use two events to detect Caps Lock up and down.
         * If we will use only 'keydown', we can detect only Caps Lock press to
         * ON state, but we cannot detect the OFF state.
         *
         * Actual only for MacOS's browsers.
         */
        document.addEventListener('keydown', this.detectCapsLock)
        document.addEventListener('keyup', this.detectCapsLock)
      }
    },

    onBlur (event) {
      if (this.isPasswordType) {
        document.removeEventListener('keydown', this.detectCapsLock)
        document.removeEventListener('keyup', this.detectCapsLock)

        if (!this.value) this.isCapsLockOn = false
      }
    },

    detectCapsLock (event) {
      /**
       * {KeyboardEvent} getModifierState
       *
       * @return {Boolean}
       */
      this.isCapsLockOn = event.getModifierState &&
        event.getModifierState('CapsLock')
    },

    normalizeTargetValue (target) {
      if (this.type === INPUT_TYPES.number && target.value !== '') {
        target.value = this.normalizeDecimalPrecision(
          this.normalizeRange(target.value)
        )
      }
    },

    normalizeRange (value) {
      const max = this.$attrs.max

      let result = value
      if (max && MathUtil.compare(value, max) > 0) {
        result = max
      }

      return result
    },

    normalizeDecimalPrecision (value) {
      const step = this.$attrs.step
      if (!step) {
        return value
      }

      let precision
      try {
        precision = step.match(/(?:\.|,)\d+$/)[0].slice(1).length
      } catch (error) {
        precision = 0
      }

      let result = value
      if (precision) {
        const decimalsLongerThanPrecisionRe =
          new RegExp(`(?:\\.|,)\\d{${precision + 1},}$`)
        if (decimalsLongerThanPrecisionRe.test(value)) {
          const truncateExtraDecimalsRe =
            new RegExp(`((?:\\.|,)\\d{${precision}})\\d*`)
          result = value.replace(truncateExtraDecimalsRe, '$1')
        }
      }

      return result
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'scss/variables';

$pwd-toggle-btn-width: 3.2rem;

.input-field {
  position: relative;
  width: 100%;
  flex: 1;
}

/* stylelint-disable no-descending-specificity */
.input-field__input {
  -webkit-text-fill-color: $field-color-text; // autofill hack
  width: 100%;
  background: none;
  border: none;
  caret-color: $field-color-focused;
  color: $field-color-text;
  padding: $field-input-padding;

  // will work only when field not in the focus
  text-overflow: ellipsis;

  @include material-border($field-color-focused, $field-color-unfocused);
  @include text-font-sizes;

  &:read-only,
  &:disabled {
    cursor: default;
    filter: grayscale(100%);
    -webkit-text-fill-color: $field-color-unfocused;
    color: $field-color-unfocused;
  }

  &::-webkit-input-placeholder {
    @include placeholder;
  }

  &::-moz-placeholder {
    @include placeholder;
  }

  &:-moz-placeholder {
    @include placeholder;
  }

  &:-ms-input-placeholder {
    @include placeholder;
  }

  &::placeholder {
    @include placeholder;
  }

  &:not(:read-only) {
    box-shadow: inset 0 0 0 5rem $field-color-background;
    // autofill hack
  }

  &--autofill-white:not([readonly]) {
    box-shadow: inset 0 0 0 5rem $col-block-bg;
  }

  &:placeholder-shown:not(:focus)::-webkit-input-placeholder {
    opacity: 0;
  }

  &:placeholder-shown:not(:focus)::-moz-placeholder {
    opacity: 0;
  }

  &:placeholder-shown:not(:focus):-moz-placeholder {
    opacity: 0;
  }

  &:placeholder-shown:not(:focus):-ms-input-placeholder {
    opacity: 0;
  }

  &:placeholder-shown:not(:focus)::placeholder {
    opacity: 0;
  }

  // Hide number arrows
  &[type='number']:not(:hover):not(:focus) {
    // autoprefixer does not help us here
    /* stylelint-disable-next-line property-no-vendor-prefix */
    -moz-appearance: textfield;

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      // autoprefixer does not help us here
      /* stylelint-disable-next-line property-no-vendor-prefix */
      -webkit-appearance: none;
      margin: 0;
    }
  }

  .input-field--monospaced > & {
    font-family: 'SourceCodePro', 'Courier', monospace;
    font-weight: 500;
  }

  // TODO: fix issue when decimal number entered in the input that have
  // mismatched "step" attribute
  //.input-field__input:not(:placeholder-shown):invalid,
  .input-field--error > & {
    @include material-border($field-color-error, $field-color-error);
  }

  .input-field--readonly > &,
  .input-field--disabled > & {
    @include readonly-material-border($field-color-unfocused);
  }

  .input-field--pwd-toggle-present > & {
    padding-right: $pwd-toggle-btn-width + 0.4rem;
  }
}

.input-field__password-toggle {
  position: absolute;
  right: 0.2rem;
  top: $field-input-padding-top - 0.6rem;
  width: 3.2rem;
  height: 3.2rem;
  cursor: pointer;

  &--autofill-white {
    background-color: $col-block-bg;
  }
}

.input-field__password-toggle-icon {
  position: relative;
  font-size: 2.4rem;
  top: 0.2rem;
  color: $field-color-unfocused;
}

.input-field__label {
  position: absolute;
  left: 0;
  top: 0;
  transition: all $field-transition-duration;
  pointer-events: none;
  color: $field-color-unfocused;
  white-space: nowrap;
  max-width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;

  @include label-font-sizes;

  .input-field__input:not(:focus):placeholder-shown ~ & {
    top: $field-input-padding-top;

    @include text-font-sizes;
  }

  .input-field__input:focus ~ & {
    color: $field-color-focused;
  }

  .input-field--readonly > .input-field__input:focus ~ &,
  .input-field--disabled > .input-field__input:focus ~ & {
    color: $field-color-unfocused;
  }

  // TODO: fix issue when decimal number entered in the input that have
  // mismatched "step" attribute
  //.input-field__input:not(:placeholder-shown):invalid ~ .input-field__label,
  .input-field--error > &,
  .input-field--error > .input-field__input:focus ~ & {
    color: $field-color-error;
  }

  .input-field__input:read-only ~ &,
  .input-field__input:disabled ~ & {
    filter: grayscale(100%);
  }

  // HACK: Minimize label on autocomplete (Chrome).
  // Do not merge with selector above.
  .input-field__input:not(:focus):placeholder-shown:-webkit-autofill ~ & {
    top: $field-input-padding-top;

    @include text-font-sizes;
  }
}

/* stylelint-enable no-descending-specificity */

.input-field__err-mes {
  color: $field-color-error;
  margin-top: $field-error-margin-top;
  font-size: $field-error-font-size;
  line-height: $field-error-line-height;
}

.input-field__err-transition-enter-active {
  animation:
    input-field__err-transition-keyframes
    $field-transition-duration
    ease-in-out;
}

.input-field__err-transition-leave-active {
  animation:
    input-field__err-transition-keyframes
    $field-transition-duration
    ease-in-out
    reverse;
}

@keyframes input-field__err-transition-keyframes {
  from {
    max-height: 0;
    margin-top: 0;
    overflow: hidden;
  }

  to {
    max-height: $field-error-font-size * $field-error-line-height;
    margin-top: $field-error-margin-top;
    overflow: hidden;
  }
}

.input-field--phone-number:before {
  position: absolute;
  top: 1.4rem;
  content: '\002B';
  left: 0;
  font-size: 1.8rem;
  line-height: 1.25;
}

.input-field--telegram:before {
  position: absolute;
  top: 1.55rem;
  content: '\0040';
  left: 0;
  font-size: 1.8rem;
  line-height: 1.25;
}

.input-field__label--icon {
  .input-field__input:not(:focus):placeholder-shown ~ & {
    top: 0;

    @include label-font-sizes;
  }
}

.input-field__padding-input {
  padding: 1.5rem 0 0.6rem 1.5rem;
}
</style>
