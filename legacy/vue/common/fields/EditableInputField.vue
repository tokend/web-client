<template>
  <div
    class="md-layout md-alignment-center-right"
    :class="{ 'editable-input-field__nowrap' : nowrap }"
  >
    <template>
      <md-field
        class="field"
        :class="{ fieldClass, 'without-pseudoclasses': !allowToEdit }"
        :inline="inline"
        :clearable="clearable"
        :toggle-password="togglePassword"
      >
        <label :for="id">{{ label }}</label>
        <md-input
          :id="id"
          :type="type"
          :name="name"
          :value="currentValue"
          :counter="counter"
          :required="required"
          :maxlength="maxlength"
          :placeholder="placeholder"
          :disabled="!allowToEdit"
          :readonly="readonly"
          :min="min"
          :max="max"
          :class="'text-align-' + align"
          :step="step"
          ref="input"
          @input="onInput"
          @blur="onBlur"
        />
        <span
          class="md-error"
          v-if="errorMessage"
        >
          {{ errorMessage }}
        </span>
      </md-field>
    </template>
    <template v-if="showIcons">
      <div class="edit">
        <md-button
          v-if="!allowToEdit"
          class="md-icon-button"
          @click="startEdit"
          :disabled="!canBeEditable"
        >
          <!-- eslint-disable-next-line -->
          <md-icon :style="iconSize ? `font-size: ${iconSize}px !important` : ''">edit</md-icon>
        </md-button>
        <template v-if="allowToEdit">
          <div
            class="md-layout"
            :class="{ 'editable-input-field__nowrap' : nowrap}"
          >
            <md-button
              class="md-icon-button"
              @click="changeValue"
            >
              <!-- eslint-disable-next-line -->
              <md-icon :style="iconSize ? `font-size: ${iconSize}px !important` : ''">done</md-icon>
            </md-button>
            <md-button
              class="md-icon-button"
              @click="finishEdit"
            >
              <!-- eslint-disable-next-line -->
              <md-icon :style="iconSize ? `font-size: ${iconSize}px !important` : ''">clear</md-icon>
            </md-button>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import FieldMixin from './field.mixin'

export default {
  name: 'editable-input-field',
  mixins: [FieldMixin],
  props: {
    type: { type: String, default: 'text' },
    maxlength: { type: [Number, String], default: '' },
    counter: { type: [Number, String], default: '' },
    readonly: { type: Boolean, default: false },
    align: { type: String, default: 'left' },
    step: { type: [Number, String], default: 0.000001 },
    disabled: { type: Boolean, default: true },
    min: { type: [Number, String], default: null },
    max: { type: [Number, String], default: null },
    fieldId: { type: [Number, String], required: true },
    iconSize: { type: String, default: '' },
    nowrap: { type: Boolean, default: false },
    canBeEditable: { type: Boolean, default: true },
    showIcons: { type: Boolean, default: true }
  },
  data () {
    return {
      allowToEdit: false,
      currentValue: null,
      savedValue: null
    }
  },
  watch: {
    value (value) {
      this.currentValue = value
    },
    disabled (value) {
      this.allowToEdit = !this.disabled
    }
  },
  created () {
    this.currentValue = this.value
    this.allowToEdit = !this.disabled
  },
  methods: {
    startEdit () {
      if (this.canBeEditable) {
        this.allowToEdit = true
        this.savedValue = this.currentValue
      }
    },
    disallowToEdit () {
      this.allowToEdit = false
    },
    finishEdit () {
      if (this.savedValue !== this.$refs.input.MdField.value) {
        this.$refs.input.localValue = this.savedValue
      }
      this.disallowToEdit()
    },
    changeValue () {
      this.currentValue = this.$refs.input.MdField.value
      if (this.savedValue !== this.currentValue) {
        this.$emit('changed-value', {
          field: this.fieldId,
          value: this.currentValue
        })
      }
      this.disallowToEdit()
    }
  }
}
</script>

<style lang="scss" scoped>
.field {
  margin: 0;
  padding: 0;
  min-height: auto;
  width: auto;
  min-width: 50px;
}
.editable-input-field__nowrap {
  flex-wrap: nowrap;
}
.without-pseudoclasses {
  &:before,
  &:after {
    display: none;
  }
}
.text-align-left {
  text-align: left;
}
.text-align-right {
  text-align: right;
}
</style>
