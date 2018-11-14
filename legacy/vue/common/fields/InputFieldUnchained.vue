<template>
  <div
    class="input-field"
    :class="{
      'input-field--error': errorMessage,
      'input-field--monospaced': monospaced,
      'input-field--readonly': readonly
  }">
    <input
      class="input-field__input"
      :class="{ 'input-field__input--autofill-white': whiteAutofill }"
      :type="type"
      :placeholder="placeholder || ' '"
      :value="value"
      :disabled="disabled"
      :name="name"
      :autocomplete="autocomplete"
      :autofocus="autofocus"
      :min="min"
      :max="max"
      :step="step"
      :maxlength="maxlength"
      :required="required"
      :readonly="readonly"
      :title="title"
      :form="form"
      :monospaced="monospaced"
      :tabindex="readonly ? -1 : tabindex"
      @input="onInput"
    >

    <span class="input-field__label">
      {{ label }}
    </span>

    <transition name="input-field__err-transition">
      <p
        class="input-field__err-mes"
        v-if="errorMessage">
        {{ errorMessage }}
      </p>
    </transition>
  </div>
</template>

<script>
export default {
  components: {
    // components
  },

  props: {
    label: { type: String, default: 'Label' },
    value: { type: [String, Number], default: undefined },
    errorMessage: { type: String, default: undefined },
    monospaced: { type: Boolean, default: false },
    tabindex: { type: Number, default: 0 },

    // proxies
    autocomplete: { type: String, default: undefined },
    maxlength: { type: [String, Number], default: undefined },
    whiteAutofill: { type: Boolean, default: false },
    autofocus: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    name: { type: String, default: undefined },
    placeholder: { type: String, default: undefined },
    type: { type: String, default: 'text' },
    required: { type: Boolean, default: true },
    readonly: { type: Boolean, default: false },
    title: { type: [String, Number], default: undefined },
    form: { type: [String, Number], default: null },

    // [type="number"] proxies
    min: { type: [String, Number], default: undefined },
    max: { type: [String, Number], default: undefined },
    step: { type: [String, Number], default: undefined }
  },

  data () {
    return {
      // data
    }
  },

  computed: {
    // computed
  },
  watch: {
    max (value) {
      if (+this.value && (+value < +this.value)) this.$emit('input', value)
    },
    min (value) {
      if (+this.value && (+value > +this.value)) this.$emit('input', value)
    }
  },

  created () {
    // created
  },

  methods: {
    onInput (event) {
      this.beforeEmit(event.target)
      this.$emit('input', event.target.value)
    },

    beforeEmit (target) {
      if (this.type === 'number') {
        this.normalizeNumberFormat(target)
        this.normalizeMinMax(target)
        this.normalizeDecimalPrecision(target)
      }
    },

    normalizeNumberFormat (target) {
      const { value } = target

      // Remove leading zeros
      if ((/^0[^.,]/).test(value)) {
        target.value = value.replace(/^0/g, '')
      }
    },

    normalizeMinMax (target) {
      const { value } = target
      const max = '' + this.max
      const min = '' + this.min

      if (value === '') {
        return null
      } else if (value > +max) {
        target.value = max
      } else if (value < +min) {
        target.value = min
      }
    },

    normalizeDecimalPrecision (target) {
      const { value } = target

      let precision
      try {
        precision = this.step.match(/(?:\.|,)\d+$/)[0].slice(1).length
      } catch (error) {
        precision = 0
      }
      if (!precision) {
        return null
      } else {
        const detectRe = new RegExp(`(?:\\.|,)\\d{${precision + 1},}$`)
        if (detectRe.test(value)) {
          const replaceRe = new RegExp(`((?:\\.|,)\\d{${precision}})\\d*`)
          target.value = value.replace(replaceRe, '$1')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "scss/fields-variables";

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
    -webkit-box-shadow: inset 0 0 0 50px $col-field-background; // autofill hack
  }

  &--autofill-white:not([readonly]) {
    -webkit-box-shadow: inset 0 0 0 50px $col-block-bg !important;
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
