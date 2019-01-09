<template>
  <div
    class="text-field"
    :class="{
      'text-field--error': errorMessage,
      'text-field--disabled': disabled
    }
    ">
    <textarea
      class="text-field__input"
      :class="{ 'text-field__input--dirty': hasValue }"
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
  input: 'input'
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
    cols: { type: [String, Number], default: undefined }
  },

  data: () => ({
    hasValue: false,
    currentLength: '0',
    EVENTS
  }),

  computed: {
    isNoLabel () {
      return this.label === null || this.label === '' || this.label === undefined
    }
  },

  methods: {
    onInput (event) {
      event.target.value === '' ? this.hasValue = false : this.hasValue = true
      if (this.maxlength) this.currentLength = event.target.value.length
      this.$emit(this.EVENTS.input, event.target.value)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "scss/variables";

  .text-field__label {
    margin-bottom: .5rem;
    display: block;
    position: absolute;
    top: 1.6rem;
    left: 1.6rem;
    color: $field-color-unfocused;
    transition: .2s ease-out;
    font-size: 1.6rem;

    .text-field__input:focus + &,
    .text-field__input.text-field__input--dirty + & {
      color: $field-color-text;
      top: .6rem;
      font-size: 1.2rem;
    }
  }

  .text-field__input {
    caret-color: $field-color-text;
    padding: 1.6rem 1.6rem 3.6rem;
    background-color: $textarea-background-color !important;
    border: .2rem solid rgba($field-color-unfocused, 0.5);
    width: 100%;
    resize: none;
    display: block;
    border-radius: .4rem;
    font-size: 1.6rem;
    transition: all 0s, border-color .2s ease-out;

    &:focus,
    &.text-field__input--dirty {
      padding-top: 2.6rem;
      padding-bottom: 2.6rem;
      border-color: $field-color-focused;
    }

    &:disabled {
      background-color: transparent;
      cursor: default;
    }
  }

  .text-field__length {
    position: absolute;
    bottom: .8rem;
    right: 1.6rem;
    font-size: .75rem;
    color: $field-color-text;
  }

  .text-field {
    width: 100%;
    position: relative;
  }
</style>
