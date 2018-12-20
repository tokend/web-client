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
      :checked="cbValue"
      @change="onChange">

    <div class="radio-field__input-custom" />

    <label
      class="radio-field__label"
      :for="id"
      :title="title">
      <slot />
    </label>
  </div>
</template>

<script>
export default {
  props: {
    name: { type: String, default: undefined },
    active: { type: [String, Boolean], default: '' },
    disabled: { type: Boolean, default: false },
    cbValue: { type: [Number, String], default: null },
    title: { type: [String, Number], default: undefined },
    required: { type: Boolean, default: false }
  },

  computed: {
    id () {
      return `radio-field-${this._uid}`
    }
  },

  methods: {
    onChange (event) {
      this.$emit('input', event.target.value)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~L@scss/variables';

  .radio-field {
    width: 100%;
    display: flex;
    align-items: center;
    padding: .8 * $point 0;
    margin: .8 * $point 0;
  }

  .radio-field__input {
    display: none;

    &:checked + .radio-field__input-custom {
      position: relative;

      &:after {
        content: '';
        position: absolute;
        top: .3 * $point;
        left: .3 * $point;
        width: .7 * $point;
        height: .7 * $point;
        background-color: $col-radio-field-border;
        border-radius: 50%;
      }
    }
  }

  .radio-field__input-custom {
    width: 1.5 * $point;
    height: 1.5 * $point;
    background-color: $col-radio-field-background;
    border: .1 * $point solid $col-radio-field-border;
    border-radius: 50%;
    margin-right: .8 * $point;
  }
</style>
