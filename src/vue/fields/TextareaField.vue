<template>
  <div
    class="text-field"
    :class="{
      'text-field--error': errorMessage,
      'text-field--disabled': disabled,
      'text-field--readonly': readonly,
      'text-field--dirty': hasValue
    }
    ">
    <textarea
      class="text-field__input"
      :placeholder="placeholder || ' '"
      :value="value"
      :disabled="disabled"
      :name="name"
      :autofocus="autofocus"
      :maxlength="maxlength"
      :required="required"
      :readonly="readonly"
      :title="title"
      :rows="rows"
      :cols="cols"
      @input="onInput"
    />

    <span
      class="text-field__label"
      :class="{'text-field__label--hidden': isNoLabel}">
      {{ label }}
    </span>

    <span
      v-if="maxlength"
      class="text-field__length">
      {{ `${currentLength}/${maxlength}` }}
    </span>

    <transition name="text-field__err-transition">
      <p
        class="text-field__err-mes"
        v-if="errorMessage">
        {{ errorMessage }}
      </p>
    </transition>
  </div>
</template>

<script>

const EVENTS = {
  input: 'input',
}

export default {
  props: {
    label: { type: String, default: 'Label' },
    value: { type: [String, Number], default: undefined },
    errorMessage: { type: String, default: undefined },

    // proxies
    autocomplete: { type: String, default: 'off' },
    autofocus: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    name: { type: String, default: undefined },
    placeholder: { type: String, default: undefined },
    required: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    title: { type: [String, Number], default: undefined },
    maxlength: { type: [String, Number], default: undefined },

    // textarea proxies
    rows: { type: [String, Number], default: 4 },
    cols: { type: [String, Number], default: undefined },
  },

  data: () => ({
    currentLength: '0',
  }),

  computed: {
    isNoLabel () {
      return this.label === null || this.label === '' || this.label === undefined
    },
    hasValue () {
      return Boolean(this.value)
    },
  },

  methods: {
    onInput (event) {
      if (this.maxlength) this.currentLength = event.target.value.length
      this.$emit(EVENTS.input, event.target.value)
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'scss/variables';

.text-field {
  width: 100%;
  position: relative;
  // we leave padding-bottom here to  keep out plugins that draw something on
  // the fields from our digit counter on the bottom
  padding-bottom: 2.6rem;
  padding-top: 2.6rem;
  caret-color: $field-color-text;
  background-color: $textarea-background-color;
  border: 0.1rem solid rgba($field-color-unfocused, 0.5);
  border-radius: 0.4rem;
  transition: all 0s, border-color 0.2s ease-out;
  overflow: hidden;

  // stylelint-disable-next-line
  &:not(.text-field--readonly):not(.text-field--disabled):hover,
  &--dirty:enabled {
    border-color: $field-color-focused;
  }

  &--disabled,
  &--readonly {
    filter: grayscale(100%);
    border-color: rgba($field-color-unfocused, 0.5); // stylelint-disable-line
    border-style: dashed;
  }
}

.text-field__label {
  cursor: default;
  margin-bottom: 0.5rem;
  display: block;
  position: absolute;
  top: 1.6rem;
  left: 1.6rem;
  color: $field-color-unfocused;
  transition: 0.2s ease-out;
  font-size: 1.6rem;
  pointer-events: none;

  .text-field--dirty > &,
  .text-field__input:focus ~ & {
    top: 0.8rem;
    font-size: 1.2rem;
  }

  .text-field__input:not(:disabled):not(:read-only):focus ~ & {
    color: $field-color-text;
  }
}

.text-field__input {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  resize: none;
  display: block;
  font-size: 1.6rem;
  overflow-y: auto;
  padding: 0 1.6rem;

  &:disabled,
  &:read-only {
    color: $field-color-unfocused;
    cursor: default;
  }
}

.text-field__length {
  position: absolute;
  bottom: 0.8rem;
  right: 1.6rem;
  font-size: 1.2rem;
  color: $field-color-unfocused;
}

.text-field__err-mes {
  position: absolute;
  bottom: 0.8rem;
  left: 1.6rem;
  max-width: 70%;
  font-size: 1.2rem;
  color: $col-error;
}

</style>
