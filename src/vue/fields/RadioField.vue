<template>
  <div class="radio-field">
    <input
      class="radio-field__input"
      type="radio"
      :disabled="disabled"
      :name="name"
      :id="id"
      :value="cbValue"
      :required="required"
      :checked="isChecked"
      @change="onChange"
    >

    <div class="radio-field__input-custom" />

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
    name: { type: String, default: null },
    disabled: { type: Boolean, default: false },
    // TODO: remove `Array` type from allowed
    active: { type: [Number, String, Array], default: null },
    cbValue: { type: [Number, String], default: null },
    title: { type: [String, Number], default: null },
    required: { type: Boolean, default: false },
  },

  computed: {
    id () {
      return `radio-field-${this._uid}`
    },
    isChecked () {
      return this.active === this.cbValue
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
.radio-field {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0.8rem 0;
}

.radio-field__input {
  display: none;

  &:checked + .radio-field__input-custom {
    position: relative;

    &:after {
      content: '';
      position: absolute;
      top: 0.3rem;
      left: 0.3rem;
      width: 0.7rem;
      height: 0.7rem;
      background-color: $col-radio-field-border;
      border-radius: 50%;
    }
  }
}

.radio-field__input-custom {
  width: 1.5rem;
  height: 1.5rem;
  background-color: $col-radio-field-background;
  border: 0.1rem solid $col-radio-field-border;
  border-radius: 50%;
  margin-right: 0.8rem;
}
</style>
