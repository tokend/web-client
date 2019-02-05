<template>
  <div
    class="text-field"
    :class="{
      'text-field--error': errorMessage,
      'text-field--disabled': disabled,
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

    <span v-if="maxlength" class="text-field__length">
      {{ `${currentLength}/${maxlength}` }}
    </span>

    <transition name="text-field__err-transition">
      <p class="text-field__err-mes" v-if="errorMessage">
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
    required: { type: Boolean, default: true },
    readonly: { type: Boolean, default: false },
    title: { type: [String, Number], default: undefined },
    maxlength: { type: [String, Number], default: undefined },

    // textarea proxies
    rows: { type: [String, Number], default: 4 },
    cols: { type: [String, Number], default: undefined },
  },

  data: () => ({
    hasValue: false,
    currentLength: '0',
  }),

  computed: {
    isNoLabel () {
      return this.label === null || this.label === '' || this.label === undefined
    },
  },

  methods: {
    onInput (event) {
      event.target.value === '' ? this.hasValue = false : this.hasValue = true
      if (this.maxlength) this.currentLength = event.target.value.length
      this.$emit(EVENTS.input, event.target.value)
    },
  },
}
</script>

<style lang="scss" scoped>
@import "scss/variables";

.text-field {
  width: 100%;
  position: relative;
  // we leave padding-bottom here to  keep out plugins that draw something on
  // the fields from our digit counter on the bottom
  padding-bottom: 2.6rem;
  caret-color: $field-color-text;
  background-color: $textarea-background-color;
  border: .2rem solid rgba($field-color-unfocused, 0.5);
  border-radius: .4rem;
  transition: all 0s, border-color .2s ease-out;
  overflow: hidden;

  &:hover, &--dirty {
    border-color: $field-color-focused;
  }
}

.text-field__label {
  cursor: default;
  margin-bottom: .5rem;
  display: block;
  position: absolute;
  top: 1.6rem;
  left: 1.6rem;
  color: $field-color-unfocused;
  transition: .2s ease-out;
  font-size: 1.6rem;
  pointer-events: none;

  .text-field__input:focus ~ &,
  .text-field--dirty & {
    color: $field-color-text;
    top: .8rem;
    font-size: 1.2rem;
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
  padding: 2.6rem 1.6rem 0;

  &:disabled {
    cursor: default;
  }
}

.text-field__length {
  position: absolute;
  bottom: .8rem;
  right: 1.6rem;
  font-size: 1.2rem;
  color: $field-color-text;
}

</style>
