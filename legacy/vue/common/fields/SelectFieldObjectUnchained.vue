<template>
  <div
    class="select-field"
    :class="{
      'select-field--readonly': readonly,
      'select-field--disabled': disabled,
      'select-field--focused': showList,
      'select-field--label-minimized': selected
    }"
  >
    <template v-if="label">
      <div class="select-field__label">{{ label }}</div>
    </template>
    <div
      class="select-field__selected"
      :class="{'select-field__selected--focused': showList}"
      @click="toggleListVisibility()"
    >
      <button class="select-field__selected-value">
        {{ selected.translationId | translate }}
      </button>
      <div>
        <md-icon
          class="select-field__selected-icon"
          :class="{ 'select-field__selected-icon--active': showList }">
          keyboard_arrow_down
        </md-icon>
      </div>
    </div>
    <div
      class="select-field__list"
      ref="list"
      :class="{ 'select-field__list--active': showList }">
      <template v-for="(val, i) in values">
        <button
          class="select-field__list-item"
          :key="`select-field-object-${i}-${val.value}`"
          :class="{
            'select-field__list-item--selected': selected === val
          }"
          @click="selectItem(val)">
          {{ val.translationId | translate }}
        </button>
      </template>
    </div>
  </div>
</template>

<script>
import { commonEvents } from 'L@/js/events/common_events'
import { onKeyDown } from 'L@/js/helpers/onKeyDown'
import { closeElement } from 'L@/js/helpers/closeElement'
import { KEY_CODES } from 'L@/js/const/const'
import { isObject } from 'L@/js/utils/isObject.util'

export default {
  name: 'select-field-unchained',
  props: {
    value: {
      type: [String, Number, Boolean, Object, Array, Date],
      default: ''
    },
    values: { type: Array, default: _ => [] },
    label: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false }
  },
  data: _ => ({
    currentValue: '', // selected item in the list
    // WARN: required for arrow navigation (looks like currentValue)
    selected: {},
    showList: false,
    KEY_CODES
  }),
  watch: {
    showList (value) {
      closeElement('select__list', value, this.closelist)
    }
  },
  created () {
    this.selected = this.value
    this.currentValue = this.value
  },
  methods: {
    isObject,
    selectItem (item) {
      if (this.readonly || this.disabled) return null
      this.selected = item
      this.currentValue = item
      this.$emit(commonEvents.inputEvent, item)
      this.toggleListVisibility()
    },
    toggleListVisibility () {
      if (this.readonly || this.disabled) return null
      this.showList ? this.closelist() : this.openList()
      onKeyDown(this.showList, this.keyDownEvents)
    },
    openList () {
      const list = this.$refs.list
      const index =
        this.values.indexOf(this.selected) >= 0
          ? this.values.indexOf(this.selected)
          : 0
      list.scrollTop =
        list.childNodes[index].offsetTop - (list.offsetHeight / 2) + 18
      this.showList = true
    },
    closelist () {
      // set active element as selected
      this.selected =
        this.values.filter((item) => item === this.currentValue)[0]
      this.showList = false
    },
    keyDownEvents (event) {
      let index = this.values.indexOf(this.selected)
      const valuesList = this.values
      const childrenList = this.$refs.list

      if (event.which === KEY_CODES.enter) {
        this.selectItem(valuesList[index])
      } else if (event.which === KEY_CODES.up) {
        index = this.selectPrevItem(index, valuesList)
      } else if (event.which === KEY_CODES.right) {
        this.selectItem(valuesList[index])
      } else if (event.which === KEY_CODES.down) {
        index = this.selectNextItem(index, valuesList)
      } else if (event.which === KEY_CODES.escape) {
        this.toggleListVisibility()
      } else if (event.shiftKey && event.which === KEY_CODES.tab) {
        index = this.selectPrevItem(index, valuesList)
      } else if (event.which === KEY_CODES.tab) {
        index = this.selectNextItem(index, valuesList)
      }

      // eslint-disable-next-line
      childrenList.scrollTop = childrenList.childNodes[index].offsetTop - (childrenList.offsetHeight / 2) + 18
    },
    selectNextItem (index, valuesList) {
      index === valuesList.length - 1 ? index = 0 : index += 1
      this.selected = valuesList[index]
      return index
    },
    selectPrevItem (index, valuesList) {
      index === 0 ? index += valuesList.length - 1 : index -= 1
      this.selected = valuesList[index]
      return index
    }
  }
}
</script>

<style scoped lang="scss">
@import "scss/fields-variables";

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

.select-field--readonly > .select-field__selected {
  cursor: default;
  @include readonly-material-border($field-color-focused);
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
