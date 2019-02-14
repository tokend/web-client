<template>
  <div
    class="select-field"
    :class="{
      'select-field--disabled': disabled,
      'select-field--focused': isListOpened,
      'select-field--label-minimized': highlighten,
      'select-field--error': errorMessage
    }"
  >
    <template v-if="label">
      <div class="select-field__label">
        {{ label }}
      </div>
    </template>
    <button
      type="button"
      class="select-field__selected"
      :class="{
        'select-field__selected--focused': isListOpened,
        'select-field__selected--padding': label
      }"
      :disabled="disabled"
      @click.prevent="toggleListVisibility"
    >
      <span class="select-field__selected-value">
        {{ selected | getValueText(keyAsValueText) }}
      </span>
      <i
        class="select-field__selected-icon mdi mdi-chevron-down"
        :class="{ 'select-field__selected-icon--active': isListOpened }"
      />
    </button>
    <div
      class="select-field__list"
      ref="list"
      :class="{ 'select-field__list--active': isListOpened }"
    >
      <button
        v-for="(item, index) in values"
        :key="index"
        type="button"
        class="select-field__list-item"
        :class="{ 'select-field__list-item--selected': highlighten === item }"
        @click.prevent="selectItem(item)"
      >
        {{ item | getValueText(keyAsValueText) }}
      </button>
    </div>
    <p
      v-if="errorMessage"
      class="select-field__err-mes"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>

<script>
/**
 * The values prop of the component accepts an array of strings or objects.
 * If you provide collection of objects you should provide also
 * key-as-value-text - name of the object key to be shown as text of selected
 * value. key-as-value-text accepts names of properties, getters and methods
 *
 * The field emits items as is - if you provide arrays of strings the string
 * will be emitted on selection, if you provide arrays of objects the object
 * will be emitted on selection.
 *
 * Example of how to provide object collection and show code of each value as
 * the value text
 *
 * <select-field
 *   :values="assets"
 *   key-as-value-text="code"
 * />
 */

import { KEY_CODES } from '@/js/const/key-codes.const'
import _get from 'lodash/get'

const EVENTS = {
  input: 'input',
}

export default {
  name: 'select-field',

  filters: {
    getValueText (item, keyAsValueText) {
      const result = keyAsValueText
        ? _get(item, keyAsValueText, item)
        : item
      return typeof result === 'function'
        ? result()
        : result
    },
  },

  props: {
    value: {
      type: [String, Number, Boolean, Object, Array, Date],
      required: true,
    },
    values: {
      type: [Array, Object],
      default: _ => [],
    },
    label: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    errorMessage: {
      type: String,
      default: '',
    },
    keyAsValueText: {
      type: String,
      default: '',
    },
  },

  data: () => ({
    selected: null,
    highlighten: null, // active list element (for arrow navigation)
    isListOpened: false,
    KEY_CODES,
  }),

  created () {
    this.highlighten = this.value
    this.selected = this.value

    document.addEventListener('keydown', this.onDocumentKeyDown)
  },

  destroyed () {
    document.removeEventListener('keydown', this.onDocumentKeyDown)
  },

  methods: {
    selectItem (item) {
      this.highlighten = item
      this.selected = item
      this.$emit(EVENTS.input, item)
      this.toggleListVisibility()
    },
    toggleListVisibility () {
      this.isListOpened ? this.closeList() : this.openList()
    },
    openList () {
      const index = this.getIndex(this.selected)
      this.highlighten = this.selected

      this.scrollList(index)
      this.isListOpened = true
      document.addEventListener('click', this.onDocumentClick)
    },
    closeList () {
      this.isListOpened = false
    },
    onDocumentClick (event) {
      if (!event.target.closest('.select-field')) {
        this.closeList()
        document.removeEventListener('click', this.onDocumentClick)
      }
    },
    onDocumentKeyDown (event) {
      if (!this.isListOpened) {
        return
      }

      event.preventDefault()
      let index = this.getIndex(this.highlighten)

      switch (event.which) {
        case KEY_CODES.enter:
          this.selectItem(this.listValues[index])
          break
        case KEY_CODES.up:
          index = this.selectPrevItem(index, this.listValues)
          break
        case KEY_CODES.right:
          this.selectItem(this.listValues[index])
          break
        case KEY_CODES.down:
          index = this.selectNextItem(index, this.listValues)
          break
        case KEY_CODES.escape:
          this.toggleListVisibility()
          break
        case KEY_CODES.tab:
          if (event.shiftKey) {
            index = this.selectPrevItem(index, this.listValues)
          } else {
            index = this.selectNextItem(index, this.listValues)
          }
          break
        default:
          return
      }
      this.scrollList(index)
    },
    getIndex (item) {
      return this.values.findIndex(it => item === it)
    },
    scrollList (index) {
      const list = this.$refs.list

      if (index !== -1) {
        list.scrollTop =
          list.childNodes[index].offsetTop - (list.offsetHeight / 2) + 18
      }
    },
    selectNextItem (index, valuesList) {
      index === valuesList.length - 1 ? index = 0 : index += 1
      this.highlighten = valuesList[index]
      return index
    },
    selectPrevItem (index, valuesList) {
      index === 0 ? index += valuesList.length - 1 : index -= 1
      this.highlighten = valuesList[index]
      return index
    },
  },
}
</script>

<style lang="scss">
@import "scss/variables";
@import "@/scss/mixins";

.select-field {
  width: 100%;
  flex: 1;
  position: relative;
}

.select-field__selected {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  width: 100%;
  background: none;
  border: none;
  caret-color: $field-color-focused;
  color: $field-color-text;

  @include material-border(
    $field-color-focused,
    $field-color-unfocused,
    "&.select-field__selected--focused"
  );

  @include text-font-sizes;

  &.select-field__selected--padding {
    padding: $field-input-padding;
  }
}

.select-field__selected-icon {
  will-change: transform;
  color: $field-color-text;
  font-size: 2.2rem;
  line-height: 1.5rem;

  &:before {
    transition: transform 0.2s ease-out;
  }

  &.select-field__selected-icon--active:before {
    transform: rotate(-180deg);
  }
}

.select-field__selected-value {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background-color: transparent;
  border: none;
  color: $field-color-text;
  @include text-font-sizes;
  cursor: pointer;
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

.select-field--disabled {
  filter: grayscale(100%);

  & > .select-field__selected {
    cursor: default;

    @include readonly-material-border($field-color-unfocused);

    & > .select-field__selected-value {
      color: $field-color-unfocused;
    }
  }
}

.select-field--focused > .select-field__label {
  color: $field-color-focused;

  @include label-font-sizes;
}

.select-field--label-minimized > .select-field__label {
  top: 0;

  @include label-font-sizes;
}

.select-field__list {
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
  z-index: 5;
  max-height: 24.4rem;
  overflow-y: auto;
  padding: 0.8rem 0;

  @include box-shadow;
}

.select-field__list--active {
  visibility: visible;
  opacity: 1;
  margin-top: 0;
}

.select-field__list-item {
  padding: 0.8rem 1.6rem;
  font-size: 1.6rem;
  transition: background-color 0.15s ease-out;
  cursor: pointer;
  border: none;
  display: block;
  width: 100%;
  text-align: left;
  background-color: transparent;
  &:not(.select-field__list-item--selected):hover {
    background-color: $col-select-field-hover-background;
  }
}

.select-field__list-item--selected {
  background-color: $col-select-field-selected-background;

  @include text-font-sizes;
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
