<template>
  <div class="tick-field">
    <input
      class="tick-field__input"
      type="checkbox"
      :checked="checked"
      :disabled="disabled"
      :name="name"
      :id="id"
      :value="cbValue"
      :required="required"
      :autofocus="autofocus"
      @change="onChange">

    <label
      class="tick-field__label"
      :for="id"
      :title="title">
      <slot />
    </label>

    <span
      class="tick-field__tick"
      :for="id"
      :title="title">
      <!-- css art -->
    </span>
  </div>
</template>

<script>

const EVENTS = {
  input: 'input',
}

export default {
  props: {
    // label: { type: String, default: 'Label' },
    value: {
      type: [String, Number, Array, Boolean],
      required: true,
      default: '' || 0,
    },
    // proxies
    name: { type: String, default: undefined },
    disabled: { type: Boolean, default: false },
    /* eslint-disable */
    cbValue: { default: undefined },
    /* eslint-enable */
    title: { type: [String, Number], default: undefined },
    required: { type: Boolean, default: false },
    autofocus: { type: Boolean, default: false },
  },

  computed: {
    id () {
      return `tick-field-${this._uid}`
    },
    checked () {
      const model = this.value
      const value = this.cbValue
      if (typeof value === 'undefined') {
        return model
      }

      let result
      switch (this.typeof(model)) {
        case 'number':
          result = model & +value
          break

        case 'array':
          result = ~model.findIndex((item) => item === value)
          break

        default:
          result = model
          break
      }
      return result
    },
  },

  methods: {
    onChange (event) {
      const isChecked = event.target.checked
      const model = this.value
      const value = this.cbValue || isChecked

      if (typeof value === 'undefined') {
        return this.$emit(EVENTS.input, isChecked)
      }

      switch (this.typeof(model)) {
        case 'number':
          this.$emit(
            EVENTS.input,
            isChecked ? model + +value : model - value
          )
          break

        case 'array':
          this.$emit(EVENTS.input, isChecked
            ? model.concat(value)
            : model.filter((item) => item !== value)
          )
          break

        default:
          this.$emit(EVENTS.input, isChecked)
          break
      }
    },
    typeof (value) {
      const type = typeof value

      let result
      switch (type) {
        case 'object':
          if (Array.isArray(value)) result = 'array'
          if (value === null) result = 'null'
          break

        default:
          result = type
          break
      }
      return result
    },
  },
}
</script>

<style lang="scss" scoped>
@import "./scss/variables";
@import "~@scss/variables";

.tick-field {
  position: relative;
  display: flex;
  z-index: 0; // HACK: fix cut of transforms on some browsers (chrome)
}

.tick-field__label {
  @include text-font-sizes;
  color: $field-color-focused;
  padding-left: 2.5rem;
}

.tick-field__tick,
.tick-field__label {
  cursor: pointer;
}

.tick-field__tick {
  width: 1.6rem;
  min-width: 1.6rem;
  height: 1.6rem;
  margin: 0.2rem 1.3rem 0 0;
  z-index: 0;
  border: solid 0.2rem;
  border-radius: 0.3rem;
  border-color: $field-color-unfocused;
  position: absolute;
  left: 0;
  display: block;
  pointer-events: none;
  outline: 0.25rem solid transparent;
  outline-offset: -0.1rem;
  transition: outline-color $field-transition-duration;

  &:after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) translateY(-0.1rem) rotate(45deg);
    display: block;
    height: 1rem;
    width: 0.6rem;
    border: solid white;
    border-width: 0 0.2rem 0.2rem 0;

    opacity: 0;
  }
}

.tick-field__input:checked ~ .tick-field__tick {
  border: none;
  background-color: $field-color-focused;

  &:after {
    opacity: 1;
  }
}

.tick-field__input {
  position: absolute;
  opacity: 0;
  pointer-events: none;

  &:checked ~ .tick-field__tick {
    border: none;
    background-color: $field-color-focused;

    &:after {
      opacity: 1;
    }
  }

  &:disabled ~ .tick-field__tick,
  &:disabled ~ .tick-field__label {
    filter: grayscale(100%);
    cursor: default;
    color: $field-color-unfocused;
  }
}

.tick-field:hover > .tick-field__tick,
.tick-field__input:focus ~ .tick-field__tick {
  outline-color: $field-color-unfocused;
}
</style>
