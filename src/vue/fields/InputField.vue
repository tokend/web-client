<template>
  <div
    class="input-field"
    :class="{
      'input-field--error': errorMessage,
      'input-field--monospaced': monospaced,
      'input-field--readonly': $attrs.readonly
    }"
  >
    <input
      v-bind="$attrs"
      v-on="listeners"
      class="input-field__input"
      :class="{
        'input-field__input--autofill-white': whiteAutofill
      }"
      :value="value"
      :placeholder="$attrs.placeholder || ' '"
      :tabindex="$attrs.readonly ? -1 : $attrs.tabindex"
    >

    <span class="input-field__label">{{ label }}</span>

    <transition name="input-field__err-transition">
      <p v-if="errorMessage" class="input-field__err-mes">
        {{ errorMessage }}
      </p>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    label: { type: String, default: 'Label' },
    value: { type: [String, Number], default: undefined },
    monospaced: { type: Boolean, default: false },
    errorMessage: { type: String, default: undefined },
    whiteAutofill: { type: Boolean, default: false }
  },

  computed: {
    listeners () {
      return {
        ...this.$listeners,
        input: event => {
          this.$emit('input', event.target.value)
        }
      }
    }
  },

  methods: {
    onInput (event) {
    }
  }
}
</script>

<style lang="scss" scoped>
@import "scss/variables";

.input-field {
  position: relative;
  width: 100%;
  flex: 1;
}

.input-field__input {
  -webkit-text-fill-color: $field-color-text; // autofill hack
  width: 100%;
  background: none;
  border: none;
  caret-color: $field-color-focused;
  color: $field-color-text;
  padding: $field-input-padding;
  @include material-border($field-color-focused, $field-color-unfocused);
  @include text-font-sizes;

  &:not([readonly]) {
    // -webkit-box-shadow: inset 0 0 0 5rem $field-color-background
    // autofill hack
  }

  &--autofill-white:not([readonly]) {
    -webkit-box-shadow: inset 0 0 0 5rem $col-block-bg !important;
  }
}

.input-field__input {
  // HACK: do not merge these rulesets

  @mixin placeholder {
    color: $field-placeholer-color;
    transition: opacity $field-transition-duration;
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
}

.input-field__label {
  position: absolute;
  left: 0;
  top: 0;
  transition: all $field-transition-duration;
  pointer-events: none;
  color: $field-color-unfocused;
  @include label-font-sizes;
}

.input-field__input:focus ~ .input-field__label {
  color: $field-color-focused;
}

.input-field__input:not(:focus):placeholder-shown ~ .input-field__label {
  top: $field-input-padding-top;
  @include text-font-sizes;
}

.input-field__input:disabled {
  cursor: default;
  filter: grayscale(100%);
  -webkit-text-fill-color: $field-color-unfocused;
  color: $field-color-unfocused;

  & ~ .input-field__label {
    filter: grayscale(100%);
  }
}

// Hide number spinner
.input-field__input[type="number"]:not(:hover):not(:focus),
.input-field__input[type="number"]:not(:hover):not(:focus) {
  -moz-appearance: textfield;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
}

.input-field__err-mes {
  color: $field-color-error;
  margin-top: $field-error-margin-top;
  font-size: $field-error-font-size;
  line-height: $field-error-line-height;
}

.input-field--monospaced > .input-field__input {
  font-family: 'SourceCodePro', Courier, monospace !important;
  font-weight: 500;
}

// TODO: fix issue when decimal number entered in the input that have
// mismatched "step" attribute
//.input-field__input:not(:placeholder-shown):invalid,
.input-field--error > .input-field__input {
  @include material-border($field-color-error, $field-color-error);
}

// TODO: fix issue when decimal number entered in the input that have
// mismatched "step" attribute
//.input-field__input:not(:placeholder-shown):invalid ~ .input-field__label,
.input-field--error > .input-field__label,
.input-field--error > .input-field__input:focus ~ .input-field__label {
  color: $field-color-error;
}

.input-field--readonly > .input-field__input {
  @include readonly-material-border($field-color-unfocused);
}

.input-field--readonly > .input-field__input:focus ~ .input-field__label {
  color: $field-color-unfocused;
}

.input-field__err-transition-enter-active {
  animation: input-field__err-transition-keyframes $field-transition-duration
    ease-in-out;
}

.input-field__err-transition-leave-active {
  animation: input-field__err-transition-keyframes $field-transition-duration
    ease-in-out reverse;
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
</style>
