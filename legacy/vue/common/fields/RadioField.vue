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
    padding: 8px 0;
    margin: 8px 0;
  }

  .radio-field__input {
    display: none;

    &:checked + .radio-field__input-custom {
      position: relative;

      &:after {
        content: '';
        position: absolute;
        top: 3px;
        left: 3px;
        width: 7px;
        height: 7px;
        background-color: $col-radio-field-border;
        border-radius: 50%;
      }
    }
  }

  .radio-field__input-custom {
    width: 15px;
    height: 15px;
    background-color: $col-radio-field-background;
    border: 1px solid $col-radio-field-border;
    border-radius: 50%;
    margin-right: 8px;
  }
</style>
