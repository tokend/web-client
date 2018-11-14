<template>
  <div class="textarea-field">
    <label :for="name">{{ title }}</label>
    <textarea
      :class="{ danger }"
      :name="name"
      :id="name"
      :value="value"
      @input="onInput"
      :placeholder="placeholder"
      :disabled="disabled"
      cols="30"
      :rows="rows" />
  </div>
</template>

<script>
import input from './input.mixin'

export default {
  name: 'textarea-field',

  mixins: [input],

  props: {
    rows: {
      type: Number,
      default: 3
    },
    danger: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~L@scss/variables';

  .textarea-field {
    label {
      // color: $col-unfocused;
      font-size: 1rem;
      display: block;
      margin-bottom: 5px;
    }

    textarea {
      background: transparent;
      border-radius: 3px;
      caret-color: $col-text-accented;
      resize: vertical;
      padding: 5px;
      width: 100%;

      &:focus {
        border-color: $col-text-accented;
      }

      &.danger,
      &.danger:focus {
        border-color: $col-accent;
      }
    }
  }
</style>
