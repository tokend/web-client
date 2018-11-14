<template>
  <md-field
    :class="fieldClass"
  >
    <label :for="id">{{ label }}</label>
    <md-select
      :placeholder="placeholder"
      :disabled="disabled"
      :multiple="multiple"
      :required="required"
      :md-dense="dense"
      :value="value"
      :name="name"
      :id="id"
      @input="onInput"
    >
      <md-option
        v-for="(val, i) in values"
        :value="val"
        :selected="val === value"
        :key="i">
        {{ val }}
      </md-option>
    </md-select>
    <span
      class="md-error"
      v-if="errorMessage">
      {{ errorMessage }}
    </span>
  </md-field>
</template>

<script>
import FieldMixin from './field.mixin'

export default {
  name: 'select-field',
  mixins: [FieldMixin],
  props: {
    values: { type: Array, default: _ => [] },
    multiple: { type: Boolean, default: false },
    dense: { type: Boolean, default: false }
  }
}
</script>

<style scoped>
</style>
