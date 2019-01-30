<template>
  <div
    class="select-field"
    :class="{
      'select-field--disabled': disabled,
      'select-field--focused': isExpanded,
      'select-field--label-minimized': selectedValue,
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
      :class="{'select-field__selected--focused': isExpanded}"
      :disabled="disabled"
      @click.prevent="toggleListVisibility"
    >
      <span class="select-field__selected-value">
        {{ getLabel(currentValue) || '&nbsp;' }}
      </span>
      <div>
        <i
          class="select-field__selected-icon mdi mdi-chevron-down"
          :class="{ 'select-field__selected-icon--active': isExpanded }"
        />
      </div>
    </button>
    <div
      class="select-field__list"
      ref="list"
      :class="{ 'select-field__list--active': isExpanded }"
    >
      <button
        v-for="(item, i) in values"
        :key="i"
        type="button"
        class="select-field__list-item"
        :class="{
          'select-field__list-item--selected':
            getValue(selectedValue) === getValue(item)
        }"
        @click.prevent="selectItem(item)"
      >
        {{ getLabel(item) }}
      </button>
    </div>
    <p v-if="errorMessage" class="select-field__err-mes">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script>
import { KEY_CODES } from '@/js/const/key-codes.const'
import _isObject from 'lodash/isObject'

const EVENTS = {
  input: 'input',
}

export default {
  name: 'select-field',
  props: {
    value: {
      type: [String, Number, Boolean, Object, Array, Date],
      default: '',
    },
    values: {
      type: Array,
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
      default: undefined,
    },
  },

  data: () => ({
    currentValue: null, // selected item in the list
    selectedValue: null, // active list element (for arrow navigation)
    isExpanded: false,
    KEY_CODES,
  }),

  watch: {
    isExpanded (value) {
      if (value) {
        document.addEventListener('click', this.onDocumentClick)
      }
    },
  },

  created () {
    const value = this.values.every(v => _isObject(v))
      ? this.values.find(v => v.value === this.value)
      : this.value
    this.selectedValue = value
    this.currentValue = value

    document.addEventListener('keydown', this.onDocumentKeyDown)
  },

  destroyed () {
    document.removeEventListener('keydown', this.onDocumentKeyDown)
  },

  methods: {
    getLabel (item) {
      return _isObject(item) ? item.label : item
    },
    getValue (item) {
      return _isObject(item) ? item.value : item
    },
    selectItem (item) {
      this.selectedValue = item
      this.currentValue = item
      this.$emit(EVENTS.input, this.getValue(item))
      this.toggleListVisibility()
    },
    toggleListVisibility () {
      this.isExpanded ? this.closeList() : this.openList()
    },
    openList () {
      const index = this.getIndex(this.currentValue)

      this.scrollList(index)
      this.isExpanded = true
    },
    closeList () {
      // set active element as selected:
      this.selectedValue = this.currentValue
      this.isExpanded = false
    },
    onDocumentClick (event) {
      if (!event.target.closest('.select__list')) {
        this.closeList()
        document.removeEventListener('click', this.onDocumentClick)
      }
    },
    onDocumentKeyDown (event) {
      if (!this.isExpanded) {
        return
      }

      let index = this.getIndex(this.selectedValue)

      switch (event.which) {
        case KEY_CODES.enter:
          this.selectItem(this.values[index])
          break
        case KEY_CODES.up:
          index = this.selectPrevItem(index, this.values)
          break
        case KEY_CODES.right:
          this.selectItem(this.values[index])
          break
        case KEY_CODES.down:
          index = this.selectNextItem(index, this.values)
          break
        case KEY_CODES.escape:
          this.toggleListVisibility()
          break
        case KEY_CODES.tab:
          if (event.shiftKey) {
            index = this.selectPrevItem(index, this.values)
          } else {
            index = this.selectNextItem(index, this.values)
          }
          break
        default:
          return
      }
      this.scrollList(index)
    },
    getIndex (item) {
      if (_isObject(item)) {
        return this.values.findIndex(entry => entry.value === item.value)
      }
      return this.values.indexOf(item)
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
      this.selectedValue = valuesList[index]
      return index
    },
    selectPrevItem (index, valuesList) {
      index === 0 ? index += valuesList.length - 1 : index -= 1
      this.selectedValue = valuesList[index]
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
  height: 5.3rem;
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
  padding: $field-input-padding;

  @include material-border(
    $field-color-focused,
    $field-color-unfocused,
    "&.select-field__selected--focused"
  );

  @include text-font-sizes;
}

.select-field__selected-icon {
  will-change: transform;
  color: $field-color-text;
  font-size: 2.2rem;
  line-height: 1.5rem;

  &:before {
    transition: transform .2s ease-out;
  }

  &.select-field__selected-icon--active:before {
    transform: rotate(-180deg)
  }
}

.select-field__selected-value {
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background-color: transparent;
  border: none;
  color: $field-color-text;
  font-size: 1.6rem;
  font-weight: 500;
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
  transition: .2s ease-out;
  margin-top: -1rem;
  position: absolute;
  left: 0;
  width: 100%;
  min-width: 16rem;
  top: 100%;
  background-color: $col-dropdown-bg;
  border-radius: .3rem;
  z-index: 5;
  max-height: 24.4rem;
  overflow-y: auto;
  padding: .8rem 0;

  @include box-shadow;
}

.select-field__list--active {
  visibility: visible;
  opacity: 1;
  margin-top: 0;
}

.select-field__list-item {
  padding: .8rem 1.6rem;
  font-size: 1.6rem;
  transition: background-color .15s ease-out;
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
