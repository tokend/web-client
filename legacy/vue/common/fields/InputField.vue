<template>
  <md-field
    :class="fieldClass"
    :inline="inline"
    :clearable="clearable"
    :toggle-password="togglePassword"
  >
    <label :for="id">{{ label }}</label>
    <md-input
      :id="id"
      :type="type"
      :name="name"
      :value="value"
      :counter="counter"
      :required="required"
      :disabled="disabled"
      :maxlength="maxlength"
      :placeholder="placeholder"
      :readonly="readonly"
      :class="'text-align-' + align"
      :step="step"
      @input="onInput"
      @blur="onBlur"
    />
    <span
      class="md-error"
      v-if="errorMessage">
      {{ errorMessage }}
    </span>
  </md-field>
</template>

<script>
import FieldMixin from './field.mixin'
import config from '@/config'

export default {
  name: 'input-field',
  mixins: [FieldMixin],
  props: {
    type: { type: String, default: 'text' },
    maxlength: { type: [Number, Object], default: 0 || null },
    counter: { type: [Number, Object], default: 0 || null },
    readonly: { type: Boolean, default: false },
    align: { type: String, default: 'left' },
    step: { type: Number, default: config.MINIMAL_NUMBER_INPUT_STEP },
    disabled: { type: Boolean, default: false }
    // TODO: need handle number properties:
    // min: { type: Number, default: 0 },
  }
}
</script>
