<template>
  <div
    class="date-field-flatpickr"
    :class="{ 'date-field-flatpickr__input--disabled': $attrs.disabled }"
  >
    <label
      class="date-field-flatpickr__label"
      :class="{
        'date-field-flatpickr__label--focus': isCalendarOpen || flatpickrDate
      }"
    >
      {{ label }}
    </label>

    <div class="date-field-flatpickr__field">
      <input
        type="text"
        ref="dateField"
        class="date-field-flatpickr__input"
        @input="dateFieldUpdated"
        v-model="flatpickrDate"
        :disabled="disabled"
        :placeholder="placeholder"
        :key="_uid"
      >
    </div>

    <div
      class="date-field-flatpickr__err-mes"
      v-if="errorMessage"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
import Flatpickr from 'flatpickr'
import moment from 'moment'

// All supported events by Flatpickr
const FLATPICKR_EVENTS = {
  onChange: 'onChange',
  onClose: 'onClose',
  onDestroy: 'onDestroy',
  onMonthChange: 'onMonthChange',
  onOpen: 'onOpen',
  onYearChange: 'onYearChange',
  onValueUpdate: 'onValueUpdate',
  onDayCreate: 'onDayCreate',
  onParseConfig: 'onParseConfig',
  onReady: 'onReady',
  onPreCalendarPosition: 'onPreCalendarPosition',
  onKeyDown: 'onKeyDown',
}

// Events that will emitted up
const EMITABLE_EVENTS = {
  getNewValue: 'getNewValue',
  input: 'input',
  onClose: FLATPICKR_EVENTS.onClose,
  onOpen: FLATPICKR_EVENTS.onOpen,
}

// Events that component uses for itself
const BUILTIN_EVENTS = {
  onClose: FLATPICKR_EVENTS.onClose,
  onOpen: FLATPICKR_EVENTS.onOpen,
}

export default {
  name: 'date-field-flatpickr',

  props: {
    value: { type: String, default: '' },
    enableTime: { type: Boolean, default: true },
    allowInput: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    disableBefore: { type: String, default: '' },
    disableAfter: { type: String, default: '' },
    placeholder: { type: String, default: 'yyyy-dd-m at HH:MM' },
    label: { type: String, default: '' },
    errorMessage: { type: String, default: undefined },
  },

  data: _ => ({
    flatpickrDate: '',
    isCalendarOpen: false,
    /**
     * Flatpickr instance
     */
    flatpickr: null,
  }),

  computed: {
    config () {
      return {
        altInput: true,
        allowInput: this.allowInput,
        altFormat: this.enableTime ? 'Y-m-d at H:i' : 'F j, Y',
        disableMobile: true,
        disable: [
          (date) => {
            if (!this.disableBefore) return false
            const stamp = moment(this.disableBefore)
            return moment(date).isBefore(stamp)
          },
          (date) => {
            if (!this.disableAfter) return false
            const stamp = moment(this.disableAfter)
            return moment(date).isAfter(stamp)
          },
        ],
        enableTime: this.enableTime,
        time_24hr: true,
      }
    },
  },

  watch: {
    /**
     * Watch for changes from parent component and update DOM
     *
     * @param {string|date} newValue
     */
    value (newValue) {
      // Prevent updates if v-model value is same as input's current value
      if (newValue === this.flatpickrDate) return
      // Sets the current selected date after value changed
      if (this.flatpickr) this.flatpickr.setDate(newValue, true)
    },
    /**
     * Watch for any config changes and redraw date-picker
     *
     * @param {object} newConfig
     */
    config: {
      deep: true,
      handler (newConfig) {
        let safeConfig = Object.assign({}, newConfig)
        // Workaround: Don't pass hooks to configs again otherwise
        // previously registered hooks will stop working
        // Notice: we are looping through all events
        // This also means that new callbacks cannot be passed once a component
        // has been initialized
        FLATPICKR_EVENTS.forEach((hook) => {
          delete safeConfig[hook]
        })

        // set new config
        this.flatpickr.set(safeConfig)
      },
    },
  },

  mounted () {
    // Return early if flatpickr is already mounted
    if (this.flatpickr) return

    let safeConfig = Object.assign({}, this.config)

    // Inject defined methods into events array
    Object.values(BUILTIN_EVENTS).forEach(hook => {
      // eslint-disable-next-line
      safeConfig[hook] = this.arrayify(safeConfig[hook] || [])
        .concat((...args) => this[hook](...args))
    })

    // Set initial date without emitting any event
    safeConfig.defaultDate = this.value || safeConfig.defaultDate

    // Init flatpickr
    this.flatpickr = new Flatpickr(this.$refs.dateField, safeConfig)

    this.flatpickrDate = this.value || safeConfig.defaultDate || null
  },

  /**
   * Free up memory
   */
  beforeDestroy () {
    if (this.flatpickr) {
      this.flatpickr.destroy()
      this.flatpickr = null
    }
  },

  methods: {
    dateFieldUpdated (event) {
      if (event) {
        // Let's wait for DOM to be updated
        this.$nextTick(() => {
          this.$emit(EMITABLE_EVENTS.input, this.flatpickrDate)
        })
      }
    },
    /**
     * @param {array} selectedDates - an array of Date objects selected by the
     *        user. When there are no dates selected, the array is empty.
     * @param {string} dateStr - a string representation of the latest selected
     *        Date object by the user. The string is formatted as per the
     *        dateFormat option.
     * @param {object} instance - the flatpickr object, containing various
     *        methods and properties.
     */
    onOpen (selectedDates, dateStr, instance) {
      this.isCalendarOpen = true
      // Let's wait for DOM to be updated
      this.$nextTick(() => {
        this.$emit(EMITABLE_EVENTS.onOpen)
      })
    },
    /**
     * @link onOpen
     */
    onClose (selectedDates, dateStr, instance) {
      this.isCalendarOpen = false
      this.flatpickrDate = dateStr
      this.flatpickr.setDate(dateStr, true)
      // Let's wait for DOM to be updated
      this.$nextTick(() => {
        this.$emit(EMITABLE_EVENTS.input, dateStr)
        this.$emit(EMITABLE_EVENTS.onClose)
      })
    },
    camelToKebab (string) {
      return string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
    },
    arrayify (obj) {
      return obj instanceof Array ? obj : [obj]
    },
  },
}

</script>

<style lang="scss">
@import "scss/variables";

.date-field-flatpickr {
  position: relative;
  width: 100%;
  flex: 1;
}

.date-field-flatpickr__input {
  width: 100%;
  background-color: transparent;
  border: none;
  caret-color: $field-color-focused;
  color: $field-color-text;
  padding: $field-input-padding;

  @include material-border($field-color-focused, $field-color-unfocused);
  @include text-font-sizes;

  @mixin placeholder {
    color: $field-placeholer-color;
    transition: opacity $field-transition-duration;
  }

  &::-webkit-input-placeholder {
    @include placeholder;
    opacity: 0;
  }

  &::-moz-placeholder {
    @include placeholder;
    opacity: 0;
  }

  &:-moz-placeholder {
    @include placeholder;
    opacity: 0;
  }

  &:-ms-input-placeholder {
    @include placeholder;
    opacity: 0;
  }

  &::placeholder {
    @include placeholder;
    opacity: 0;
  }

  &.active {
    &::-webkit-input-placeholder {
      opacity: 1;
    }

    &::-moz-placeholder {
      opacity: 1;
    }

    &:-moz-placeholder {
      opacity: 1;
    }

    &:-ms-input-placeholder {
      opacity: 1;
    }

    &::placeholder {
      opacity: 1;
    }
  }
}

.date-field-flatpickr__input--disabled {
  cursor: default;
  filter: grayscale(100%);
  -webkit-text-fill-color: $field-color-unfocused;
  color: $field-color-unfocused;

  & ~ .input-field__label {
    filter: grayscale(100%);
  }
}

.date-field-flatpickr__label {
  position: absolute;
  left: 0;
  top: $field-input-padding-top;
  transition: all $field-transition-duration;
  pointer-events: none;
  color: $field-color-unfocused;
  @include text-font-sizes;
}

.date-field-flatpickr__label--focus {
  top: 0;
  @include label-font-sizes;
}

.date-field-flatpickr__err-mes {
  color: $field-color-error;
  margin-top: $field-error-margin-top;
  font-size: $field-error-font-size;
  line-height: $field-error-line-height;
}
</style>
