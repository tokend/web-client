<template>
  <div
    class="date-field-flatpickr"
    :class="{ 'date-field-flatpickr__input--disabled': disabled }"
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
        :disabled="disabled"
        v-model="flatpickrDate"
        :placeholder="placeholder"
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
const FLATPICKR_HOOKS = {
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
  onClose: FLATPICKR_HOOKS.onClose,
  onOpen: FLATPICKR_HOOKS.onOpen,
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
    placeholder: { type: String, default: 'dd/mm/yyyy at HH:MM' },
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
        altFormat: this.enableTime ? 'd/m/Y at H:i' : 'd/m/Y',
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
    value (newValue) {
      // Prevent updates if v-model value is same as input's current value
      if (newValue === this.flatpickrDate) return
      // Sets the current selected date after value changed
      if (this.flatpickr) this.flatpickr.setDate(newValue, true)
    },

    config: {
      deep: true,
      handler (newConfig) {
        const safeConfig = Object.assign({}, newConfig)

        // Workaround: Don't pass hooks to configs again otherwise
        // previously registered hooks will stop working
        // This also means that new callbacks cannot be passed once a component
        // has been initialized
        this.flatpickr.set(this.defineFlatpickrHooks(safeConfig))
      },
    },

    /**
     * We can set disabled state only directly, because of flatpickr does not
     * provide any config options
     *
     * @link https://github.com/flatpickr/flatpickr/issues/777
     */
    disabled (value) {
      if (value) {
        this.flatpickr._input.setAttribute('disabled', 'disabled')
      } else {
        this.flatpickr._input.removeAttribute('disabled')
      }
    },
  },

  mounted () {
    if (this.flatpickr) return

    let safeConfig = Object.assign({}, this.config)

    const hooks = {
      [FLATPICKR_HOOKS.onClose]: this.arrayify(
        safeConfig[FLATPICKR_HOOKS.onClose]
      ).concat(
        (...args) => this.onClose(...args)
      ),
      [FLATPICKR_HOOKS.onOpen]: this.arrayify(
        safeConfig[FLATPICKR_HOOKS.onOpen]
      ).concat(
        (...args) => this.onOpen(...args)
      ),
    }

    // Inject defined methods into hooks array

    safeConfig = {
      ...safeConfig,
      ...hooks,
    }

    // Set initial date without emitting any event
    safeConfig.defaultDate = this.value || safeConfig.defaultDate

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
    defineFlatpickrHooks (config) {
      let safeConfig = Object.assign({}, config)
      FLATPICKR_HOOKS.forEach((hook) => {
        delete safeConfig[hook]
      })
      return safeConfig
    },
    arrayify (obj) {
      if (!obj) {
        return []
      }
      return obj instanceof Array ? obj : [obj]
    },

    /* FLATPICKR HOOKS */

    /**
     * Function arguments doc:
     *
     * @link https://flatpickr.js.org/events/#events
     */
    onOpen (selectedDates, dateStr, instance) {
      this.isCalendarOpen = true
      // Let's wait for DOM to be updated
      this.$nextTick(() => {
        this.$emit(EMITABLE_EVENTS.onOpen)
      })
    },
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
  },
}

</script>

<style lang="scss">
@import 'scss/variables';

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
}

.date-field-flatpickr__input.active {
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

.date-field-flatpickr__input--disabled {
  cursor: default;
  filter: grayscale(100%);
  -webkit-text-fill-color: $field-color-unfocused;
  color: $field-color-unfocused;
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
