<template>
  <div
    class="select-field"
    :class="{
      'select-field--error': errorMessage,
      'select-field--disabled': $attrs.disabled,
      'select-field--readonly': $attrs.readonly,
    }"
  >
    <template v-if="label">
      <label
        class="select-field__label"
        :class="{ 'select-field__label--minimized': value || isListOpened }"
      >
        {{ label }}
      </label>
    </template>

    <select
      :id="`select-${_uid}`"
      class="select-field__select"
      :value="value"
      v-bind="$attrs"
      @change="onChange"
    >
      <slot />
    </select>

    <i
      class="select-field__selected-icon mdi mdi-chevron-down"
      :class="{ 'select-field__selected-icon--active': isListOpened }"
    />

    <p
      v-if="errorMessage"
      class="select-field__err-mes"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>

<script>
import customSelect from 'custom-select'

const CUSTOM_SELECT_CONFIG = {
  containerClass: 'select-field__wrp',
  openerClass: 'select-field__opener',
  panelClass: 'select-field__panel',
  optionClass: 'select-field__option',
  isSelectedClass: 'select-field__option--selected',
  hasFocusClass: 'select-field__option--focused',
  isDisabledClass: 'select-field__wrp--disabled',
  isOpenClass: 'select-field--open',
}

export default {
  props: {
    label: {
      type: String,
      default: '',
    },
    value: {
      type: [String, Number, Boolean, Object, Array, Date],
      required: true,
      default: '',
    },
    errorMessage: {
      type: String,
      default: '',
    },
  },

  data: _ => ({
    customSelectInstance: {},
    isListOpened: false,
  }),

  watch: {
    value (value) {
      this.customSelectInstance.value = value
    },
  },

  mounted () {
    this.customSelectInstance = customSelect(
      `#select-${this._uid}`, CUSTOM_SELECT_CONFIG
    )[0]

    if (this.customSelectInstance && this.customSelectInstance.container) {
      this.addCustomSelectEvents()
    }

    if (!this.value) {
      this.fixDisplayOfEmptyValue()
    }
  },

  beforeDestroy () {
    if (this.customSelectInstance && this.customSelectInstance.container) {
      this.removeCustomSelectEvents()
    }
  },

  methods: {
    onChange (event) {
      this.$emit('input', event.target.value)
    },

    addCustomSelectEvents () {
      this.customSelectInstance.container.addEventListener(
        'custom-select:open',
        e => { this.isListOpened = true }
      )
      this.customSelectInstance.container.addEventListener(
        'custom-select:close',
        e => { this.isListOpened = false }
      )
      this.customSelectInstance.container.addEventListener(
        'keydown',
        e => { e.preventDefault() }
      )
    },

    removeCustomSelectEvents () {
      this.customSelectInstance.container.removeEventListener(
        'custom-select:open',
      )
      this.customSelectInstance.container.removeEventListener(
        'custom-select:close',
      )
      this.customSelectInstance.container.removeEventListener(
        'keydown',
      )
    },

    // Design requires select fields be displayed with the same height
    // whether the field filled out or not. When there is no value, the field
    // has no content to stretch the field, so we need to add a non-breakable
    // space manually. We cannot add an <option> with empty value cuz it
    // produces an additional unneeded option be rendered. If we add anything
    // except of &nbsp; that 'anything' will overlap field’s label.
    fixDisplayOfEmptyValue () {
      const opener = this.$el
        .querySelector(`.${CUSTOM_SELECT_CONFIG.openerClass} > span`)

      if (opener) {
        opener.innerHTML = '&nbsp;'
      }
    },
  },
}
</script>

<style lang="scss">
@import 'scss/variables';
@import '@/scss/mixins';

.select-field {
  width: 100%;
  flex: 1;
  position: relative;
}

.select-field__wrp {
  position: relative;
}

.select-field__opener {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  width: 100%;
  background: none;
  border: none;
  padding: $field-input-padding;
  padding-right: 2.4rem;

  @include material-border(
    $field-color-focused,
    $field-color-unfocused,
    '&.select-field__option--focused'
  );

  .select-field--disabled > .select-field__wrp > &,
  .select-field--readonly > .select-field__wrp > & {
    cursor: default;
    pointer-events: none;
    color: $field-color-unfocused;

    @include readonly-material-border($field-color-unfocused);
  }
}

.select-field__opener span {
  @include text-font-sizes;
}

.select-field__wrp select {
  display: none;
}

.select-field__panel {
  opacity: 0;
  visibility: hidden;
  transition: 0.2s ease-out;
  margin-top: -1rem;
  position: absolute;
  left: 0;
  width: 100%;
  min-width: 16rem;
  top: 100%;
  background-color: $col-dropdown-bg;
  border-radius: 0.3rem;
  z-index: $z-index-select-field-list;
  max-height: 24.4rem;
  overflow-y: auto;
  padding: 0.8rem 0;

  @include respond-to-custom($sidebar-hide-bp) {
    top: auto;
    bottom: 0;
  }
  @include box-shadow;
}

.select-field--open .select-field__panel {
  visibility: visible;
  opacity: 1;
  margin-top: 0;
}

.select-field__option {
  padding: 0.8rem 1.6rem;
  font-size: 1.6rem;
  transition: background-color 0.15s ease-out;
  cursor: pointer;
  border: none;
  display: block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  background-color: transparent;
}

.select-field__option--focused {
  background-color: $col-select-field-hover-background;
}

.select-field__option--selected {
  background-color: $col-select-field-selected-background;

  &:before {
    content: '✔';
    padding-right: 0.5rem;
  }
}

.select-field__label {
  position: absolute;
  left: 0;
  top: $field-input-padding-top;
  transition: all $field-transition-duration;
  pointer-events: none;
  color: $field-color-unfocused;

  @include text-font-sizes;
}

.select-field__selected-icon {
  position: absolute;
  right: 0;
  top: 1.8rem;
  will-change: transform;
  color: $field-color-text;
  font-size: 2.2rem;
  line-height: 1.5rem;
  pointer-events: none;

  &:before {
    transition: transform 0.2s ease-out;
  }

  .select-field--disabled > &,
  .select-field--readonly > & {
    filter: grayscale(100%);
    color: $field-color-unfocused;
  }
}

.select-field__selected-icon--active:before {
  transform: rotate(-180deg);
}

.select-field--disabled,
.select-field--readonly {
  filter: grayscale(100%);
}

.select-field--focused > .select-field__label {
  top: 0;
  color: $field-color-focused;

  @include label-font-sizes;
}

.select-field__label--minimized {
  top: 0;

  @include label-font-sizes;
}

.select-field__err-mes {
  color: $field-color-error;
  margin-top: $field-error-margin-top;
  font-size: $field-error-font-size;
  line-height: $field-error-line-height;
}

.select-field--error > .select-field__selected {
  @include material-border($field-color-error, $field-color-error);
}

.select-field--error > .select-field__label,
.select-field--error .select-field__selected-icon {
  color: $field-color-error;
}
</style>
