import { KEY_CODES } from '@/js/const/key-codes.const'
import _isObject from 'lodash/isObject'

export default {
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
  },

  data: _ => ({
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
    const value = this.values.find(v => this.getValue(v) === this.value)
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
      this.$emit('input', this.getValue(item))
      this.toggleListVisibility()
    },
    toggleListVisibility () {
      this.isExpanded ? this.closeList() : this.openList()
    },
    openList () {
      if (this.currentValue) {
        const index = this.getIndex(this.currentValue)
        this.scrollList(index)
      }
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
