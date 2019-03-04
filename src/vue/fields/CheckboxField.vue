<template>
  <div class="checkbox-field">
    <input
      class="checkbox-field__input"
      type="checkbox"
      :disabled="disabled"
      :name="name"
      :id="id"
      :required="required"
      @change="onChange">

    <label
      class="checkbox-field__label"
      :for="id"
    >
      {{ title }}
    </label>
  </div>
</template>

<script>

const EVENTS = {
  change: 'update:isSendingEnabled',
}

export default {
  props: {
    name: { type: String, default: undefined },
    disabled: { type: Boolean, default: false },
    title: { type: [String, Number], default: undefined },
    required: { type: Boolean, default: false },
    isSendingEnabled: { type: Boolean, default: false },
  },

  computed: {
    id () {
      return `checkbox-field-${this._uid}`
    },
  },

  methods: {
    onChange (event) {
      this.$emit(EVENTS.change, event.target.checked)
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '~@scss/variables';

  .checkbox-field {
    width: 100%;
    display: flex;
    align-items: center;
    padding: .8rem 0;
    margin: .8rem 0;
  }

  .checkbox-field__input {
    width: auto;
    margin: 2rem;

    &:checked + .checkbox-field__input-custom {
      position: relative;

      &:after {
        content: '';
        position: absolute;
        top: .3rem;
        left: .3rem;
        width: .7rem;
        height: .7rem;
        background-color: $col-switch-field-enabled-border;
        border-radius: 50%;
      }
    }
  }

  .checkbox-field__label {
    font-size: 1.8rem;
  }

  .checkbox-field__input-custom {
    width: 1.5rem;
    height: 1.5rem;
    background-color: $col-switch-field-disabled-border;
    border: .1rem solid $col-switch-field-enabled-border;
    border-radius: 50%;
    margin-right: .8rem;
  }
</style>
