<template>
  <div class="radio-field">
    <input
      class="radio-field__input"
      type="radio"
      :disabled="disabled"
      :name="name || id"
      :id="id"
      :value="cbValue"
      :required="required"
      :checked="isChecked"
      @change="onChange"
    >

    <div class="radio-field__tick" />

    <label
      class="radio-field__label"
      :for="id"
      :title="title"
    >
      <slot />
    </label>
  </div>
</template>

<script>

const EVENTS = {
  input: 'input',
}

export default {
  props: {
    name: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    value: { type: [String, Number], required: true },
    cbValue: { type: [String, Number], default: '' },
    title: { type: [String, Number], default: '' },
    required: { type: Boolean, default: false },
  },

  computed: {
    id () {
      return `radio-field-${this._uid}`
    },
    isChecked () {
      if (typeof this.cbValue === 'number') {
        return +this.cbValue === +this.value
      }
      return this.cbValue === this.value
    },
  },

  methods: {
    onChange (event) {
      this.$emit(EVENTS.input, event.target.value)
    },
  },
}
</script>

<style lang="scss">
@import './scss/variables';
@import '~@scss/variables';

// HACK: fix cut of transforms on some browsers (chrome)
$z-index-radio-field: 0;
$tick-size: 1.8rem;

.radio-field {
  position: relative;
  display: flex;
  width: fit-content;
  z-index: $z-index-radio-field;
}

.radio-field__label {
  font-size: 1.4rem;
  color: $field-color-focused;
  vertical-align: middle;
  padding-left: 2.8rem;
  cursor: pointer;

  .radio-field__input:disabled ~ & {
    filter: grayscale(100%);
    cursor: default;
    color: $field-color-unfocused;
  }
}

.radio-field__tick {
  width: $tick-size;
  min-width: $tick-size;
  height: $tick-size;
  cursor: pointer;
  margin: 0 1.3rem 0 0;
  z-index: $z-index-radio-field;
  border: solid 0.1rem;
  border-radius: 50%;
  border-color: $field-color-unfocused;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  display: block;
  pointer-events: none;
  transition: outline-color $field-transition-duration;

  &:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: block;
    border-radius: 50%;
    height: $tick-size * 0.5;
    width: $tick-size * 0.5;
    background-color: $field-color-focused;
    opacity: 0;
  }

  .radio-field__input:checked ~ & {
    &:after {
      opacity: 1;
    }
  }

  .radio-field__input:disabled ~ & {
    filter: grayscale(100%);
    cursor: default;
    color: $field-color-unfocused;
  }

  .radio-field:hover > & {
    outline-color: $field-color-unfocused;
  }

  .radio-field__input:focus ~ & {
    outline-color: $field-color-unfocused;
  }
}

.radio-field__input {
  position: absolute;
  opacity: 0;
  height: $tick-size;
  width: $tick-size;
  top: 0;
  left: 0;
  cursor: pointer;
}
</style>
