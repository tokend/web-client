<template>
  <div class="tick-field">
    <input
      class="tick-field__input"
      type="checkbox"
      v-bind="$attrs"
      :checked="checked"
      :name="$attrs.name || id"
      :id="id"
      :value="cbValue"
      @change="onChange"
    >

    <label
      class="tick-field__label"
      :for="id"
      :title="$attrs.title"
    >
      <slot />
    </label>

    <div class="tick-field__tick" />
  </div>
</template>

<script>

const EVENTS = {
  input: 'input',
}

export default {
  props: {
    value: { type: [String, Number, Array, Boolean], required: true },
    cbValue: { type: [String, Number, Boolean, Array, Object], default: false },
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
          result = this.typeof(value) !== 'array'
            ? ~model.findIndex((item) => item === value)
            : value.every(item => this.arrayIncludes(model, item))
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
          if (this.typeof(value) !== 'array') {
            this.$emit(EVENTS.input, isChecked
              ? model.concat(value)
              : model.filter((item) => item !== value))
          } else {
            this.$emit(EVENTS.input, isChecked
              ? model.concat(value)
              : model.filter((item) => !this.arrayIncludes(value, item)))
          }
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
    arrayIncludes (array, value) {
      return Boolean(array.find(item => item === value))
    },
  },
}
</script>

<style lang="scss">
@import './scss/variables';
@import '~@scss/variables';

// HACK: fix cut of transforms on some browsers (chrome)
$z-index-tick-field: 0;
$tick-size: 1.8rem;

.tick-field {
  position: relative;
  display: flex;
  width: fit-content;
  z-index: $z-index-tick-field;
}

.tick-field__label {
  font-size: 1.4rem;
  color: $field-color-focused;
  vertical-align: middle;
  padding-left: 2.8rem;
  cursor: pointer;

  .tick-field__input:disabled ~ & {
    filter: grayscale(100%);
    cursor: default;
    color: $field-color-unfocused;
  }
}

.tick-field__tick {
  width: $tick-size;
  min-width: $tick-size;
  height: $tick-size;
  cursor: pointer;
  margin: 0 1.3rem 0 0;
  z-index: $z-index-tick-field;
  border: solid 0.1rem;
  border-radius: 0.2rem;
  border-color: $field-color-unfocused;
  position: absolute;
  left: 0;
  top: calc(50% - #{$tick-size * 0.1});
  transform: translateY(-50%);
  pointer-events: none;
  outline: 0.25rem solid transparent;
  outline-offset: -0.1rem;
  transition: outline-color $field-transition-duration;

  &:after {
    content: '';
    position: absolute;
    top: calc(50% - #{$tick-size * 0.1});
    left: 50%;
    transform: translate(-50%, -50%) rotate(45deg);
    display: block;
    height: $tick-size * 0.5;
    width: $tick-size * 0.25;
    border: solid white;
    border-width: 0 0.2rem 0.2rem 0;
    opacity: 0;
  }

  .tick-field__input:checked ~ & {
    border: none;
    background-color: $field-color-focused;

    &:after {
      opacity: 1;
    }
  }

  .tick-field__input:disabled ~ & {
    filter: grayscale(100%);
    cursor: default;
    color: $field-color-unfocused;
  }

  .tick-field__input:focus ~ & {
    outline-color: $field-color-unfocused;
  }

  .tick-field:hover > .tick-field__input:enabled ~ & {
    outline-color: $field-color-unfocused;
  }
}

.tick-field__input {
  position: absolute;
  opacity: 0;
  height: $tick-size;
  width: $tick-size;
  top: calc(50% - #{$tick-size * 0.1});
  transform: translateY(-50%);
  left: 0;
  cursor: pointer;

  &:disabled {
    cursor: default;
  }
}
</style>
