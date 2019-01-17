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
      <flat-pickr
        v-bind="$attrs"
        v-on="$listeners"
        class="date-field-flatpickr__input"
        :config="config"
        v-model="flatpickrDate"
        :placeholder="placeholder || ' '"
        :key="flatpickrDate + $attrs.disabled"
        @input.native="dateFieldUpdated"
        @on-close="onClose"
        @on-open="onOpen"
        @blur="onBlur"
      />
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
import FlatPickr from 'vue-flatpickr-component'
import moment from 'moment'

export default {
  name: 'date-field-flatpickr',

  components: {
    FlatPickr,
  },

  props: {
    value: { type: String, default: '' },
    enableTime: { type: Boolean, default: true },
    disableBefore: { type: String, default: '' },
    disableAfter: { type: String, default: '' },
    placeholder: { type: String, default: 'yyyy-dd-m at HH:MM' },
    label: { type: String, default: '' },
    errorMessage: { type: String, default: undefined },
  },

  data: _ => ({
    flatpickrDate: '',
    isCalendarOpen: false,
  }),

  computed: {
    config () {
      return {
        altInput: true,
        allowInput: true,
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
    'value': function () {
      this.flatpickrDate = this.value
    },
  },

  created () {
    this.flatpickrDate = this.value
  },

  methods: {
    dateFieldUpdated (event) {
      if (event) {
        this.$emit('input', this.flatpickrDate)
      }
    },
    onOpen () {
      this.isCalendarOpen = true
    },
    onClose () {
      this.isCalendarOpen = false
      this.$emit('getNewValue', this.flatpickrDate)
    },
    onBlur (event) {
      this.$emit('getNewValue', this.flatpickrDate)
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
