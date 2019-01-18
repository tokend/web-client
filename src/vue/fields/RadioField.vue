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

const EVENTS = {
  input: 'input'
}

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
      this.$emit(EVENTS.input, event.target.value)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~@scss/variables';

  .radio-field {
    width: 100%;
    display: flex;
    align-items: center;
    padding: .8rem 0;
    margin: .8rem 0;
  }

  .radio-field__input {
    display: none;

    &:checked + .radio-field__input-custom {
      position: relative;

      &:after {
        content: '';
        position: absolute;
        top: .3rem;
        left: .3rem;
        width: .7rem;
        height: .7rem;
        background-color: $col-radio-field-border;
        border-radius: 50%;
      }
    }
  }

  .radio-field__input-custom {
    width: 1.5rem;
    height: 1.5rem;
    background-color: $col-radio-field-background;
    border: .1rem solid $col-radio-field-border;
    border-radius: 50%;
    margin-right: .8rem;
  }
</style>
