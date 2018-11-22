<template>
  <div
    class="select-field"
    :class="{
      'select-field--disabled': disabled,
      'select-field--focused': isExpanded,
      'select-field--label-minimized': selectedValue
    }"
  >
    <template v-if="label">
      <div class="select-field__label">{{ label }}</div>
    </template>
    <button
      class="select-field__selected"
      :class="{'select-field__selected--focused': isExpanded}"
      :disabled="disabled"
      @click.prevent="toggleListVisibility()"
    >
      <span class="select-field__selected-value">
        {{ getValue(currentValue) || '&nbsp;' }}
      </span>
      <div>
        <md-icon
          class="select-field__selected-icon"
          :class="{ 'select-field__selected-icon--active': isExpanded }">
          keyboard_arrow_down
        </md-icon>
      </div>
    </button>
    <div
      class="select-field__list"
      ref="list"
      :class="{ 'select-field__list--active': isExpanded }"
    >
      <button
        v-for="(val, i) in values"
        :key="i"
        class="select-field__list-item"
        :class="{ 'select-field__list-item--selected': selectedValue === val }"
        @click.prevent="selectItem(val)"
      >
        {{ getValue(val) }}
      </button>
    </div>
  </div>
</template>

<script>
import { KEY_CODES } from '@/js/const/key-codes.const'
import _isObject from 'lodash/isObject'

export default {
  name: 'select-field',
  props: {
    value: {
      type: [String, Number, Boolean, Object, Array, Date],
      default: ''
    },
    values: {
      type: Array,
      default: _ => []
    },
    label: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  data: _ => ({
    currentValue: null, // selected item in the list
    selectedValue: null, // active list element (for arrow navigation)
    isExpanded: false,
    KEY_CODES
  }),

  watch: {
    isExpanded (value) {
      if (value) {
        document.addEventListener('click', this.onDocumentClick)
      }
      // closeElement('select__list', value, this.closeList)
    }
  },

  created () {
    this.selectedValue = this.value
    this.currentValue = this.value

    document.addEventListener('keydown', this.onDocumentKeyDown)
  },

  destroyed () {
    document.removeEventListener('keydown', this.onDocumentKeyDown)
  },

  methods: {
    getValue (item) {
      return _isObject(item) ? item.label : item
    },
    selectItem (item) {
      this.selectedValue = item
      this.currentValue = item
      this.$emit('input', this.getValue(item))
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
      this.selectedValue = this.currentValue // set active element as selected
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
      if (!_isObject(item)) {
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
    }
  }
}
</script>

<style scoped lang="scss">
@import "scss/variables";

.select-field {
  width: 100%;
  flex: 1;
  position: relative;
}

.select-field__selected {
  display: flex;
  justify-content: space-between;
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

.select-field__selected-value {
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background-color: transparent;
  border: none;
  color: $field-color-text;
  font-size: 16px;
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

.select-field--disabled > .select-field__selected {
  cursor: default;
  @include readonly-material-border($field-color-focused);
}

.select-field--focused > .select-field__label {
  color: $field-color-focused;
  @include label-font-sizes;
}

.select-field--label-minimized > .select-field__label {
  top: 0;
  @include label-font-sizes;
}

.select-field__selected-icon {
  margin: 0;
  will-change: transform;
  color: $col-field-icon !important;
  transition: 0.2s ease-out;
  margin-top: -2px;
  width: 20px;
  height: 20px;

  &.select-field__selected-icon--active {
    transform: rotate(-180deg);
  }
}

.select-field__list {
  opacity: 0;
  visibility: hidden;
  transition: 0.2s ease-out;
  margin-top: -10px;
  position: absolute;
  left: 0;
  min-width: 170px;
  top: calc(100% + 4px);
  background-color: $col-dropdown-bg;
  box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.15);
  border-radius: 3px;
  z-index: 5;
  max-height: 244px;
  overflow-y: auto;
  padding: 8px 0;
}

.select-field__list--active {
  visibility: visible;
  opacity: 1;
  margin-top: 0;
}

.select-field__list-item {
  padding: 8px 16px;
  font-size: 16px;
  transition: background-color 0.15s ease-out;
  cursor: pointer;
  border: none;
  display: block;
  width: 100%;
  text-align: left;
  background-color: transparent;

  &:not(.select-field__list-item--selected):hover {
    background-color: rgba(58, 65, 128, 0.05);
  }
}

.select-field__list-item--selected {
  background-color: rgba(58, 65, 128, 0.1);
  @include text-font-sizes;
}
</style>
