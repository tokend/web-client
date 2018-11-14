<template>
  <div class="select">
    <div
      v-if="label"
      class="select__label">
      {{ label }}
    </div>
    <div
      class="select__selected"
      :class="{ 'select__selected--readonly': readonly }"
      @click="toggleListVisibility()">
      <button class="select__selected-value">{{ currentValue }}</button>
      <md-icon
        class="select__selected-icon"
        :class="{ 'select__selected-icon--active': showList }">
        keyboard_arrow_down
      </md-icon>
    </div>
    <div
      class="select__list"
      ref="list"
      :class="{ 'select__list--active': showList }">
      <template v-for="(item, i) in values">
        <button
          class="select__list-item"
          :key="i"
          :class="{ 'select__list-item--selected': selected === item }"
          @click="selectItem(item)">
          {{ item }}
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

export default {
  name: 'select-field-custom',
  props: {
    value: {
      type: [String, Number, Boolean, Array, Object, Date],
      default: ''
    },
    values: { type: Array, default: _ => [] },
    label: { type: String, default: '' },
    readonly: { type: Boolean, default: false }
  },
  data: _ => ({
    currentValue: '', // selected item in the list
    selected: '', // active element but not selected (for support arrow navigation)
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
    selectItem (item) {
      if (this.readonly) return false
      this.selected = item
      this.currentValue = item
      this.$emit(commonEvents.inputEvent, item)
      this.toggleListVisibility()
    },
    toggleListVisibility () {
      if (this.readonly) return false
      this.showList ? this.closelist() : this.openList()
      onKeyDown(this.showList, this.keyDownEvents)
    },
    openList () {
      const list = this.$refs.list
      const index = this.values.indexOf(this.currentValue)
      list.scrollTop =
        list.childNodes[index].offsetTop - (list.offsetHeight / 2) + 18
      this.showList = true
    },
    closelist () {
      this.selected = this.currentValue // set active element as selected
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

      childrenList.scrollTop =
        childrenList.childNodes[index].offsetTop -
        (childrenList.offsetHeight / 2) + 18
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
  @import '~L@scss/variables';
  @import "scss/fields-variables";

  .select {
    position: relative;
  }

  .select__selected {
    color: $field-color-text;
    white-space: nowrap;
    font-size: 18px;
    display: flex;
    cursor: pointer;
  }

  .select__selected--readonly { opacity: .5; }

  .select__selected-icon {
    margin: 0;
    will-change: transform;
    color: $field-color-text !important;
    transition: .2s ease-out;
    margin-top: -2px;

    &.select__selected-icon--active {
      transform: rotate(-180deg)
    }
  }

  .select__list {
    opacity: 0;
    visibility: hidden;
    transition: .2s ease-out;
    margin-top: -10px;
    position: absolute;
    left: 0;
    min-width: 170px;
    top: calc(100% + 4px);
    background-color: $col-dropdown-bg;
    box-shadow: 0 4px 10px 0 rgba(0, 0, 0, .15);
    border-radius: 3px;
    z-index: 5;
    max-height: 244px;
    overflow-y: auto;
    padding: 8px 0;
  }

  .select__list--active {
    visibility: visible;
    opacity: 1;
    margin-top: 0;
  }

  .select__list-item {
    padding: 8px 16px;
    font-size: 16px;
    transition: .15s ease-out;
    cursor: pointer;
    white-space: nowrap;
    border: none;
    display: block;
    width: 100%;
    text-align: left;
    background-color: transparent;

    &:not(.select__list-item--selected):hover {
      background-color: $col-select-field-hover;
    }
  }

  .select__selected-value {
    background-color: transparent;
    border: none;
    color: $field-color-text;
    font-size: 18px;
    font-weight: 500;
    cursor: pointer;
  }

  .select__label {
    color: $field-color-unfocused;
    font-size: 12px;
  }

  .select__list-item--selected {
    color: $field-color-text;
  }
</style>
