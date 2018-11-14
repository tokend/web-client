<template>
  <md-datepicker
    :id="id"
    :name="name"
    :value="value"
    :required="required"
    :disabled="disabled"
    :class="fieldClass"
    :md-open-on-focus="openOnFocus"
    :md-disabled-dates="disabledDates"
    :md-override-native="overrideNative"
    @input="onInput"
  >
    <label>{{ label }}</label>
    <span
      class="md-error"
      v-if="errorMessage">
      {{ errorMessage }}
    </span>
  </md-datepicker>
</template>

<script>
import { commonEvents } from '../../../js/events/common_events'
import FieldMixin from './field.mixin'
import moment from 'moment'

export default {
  name: 'date-field',
  mixins: [FieldMixin],
  props: {
    disableBefore: { type: String, default: '' },
    disableAfter: { type: String, default: '' },
    overrideNative: { type: Boolean, default: false },
    openOnFocus: { type: Boolean, default: true }
  },
  computed: {
    disabledDates () {
      if (!this.disableBefore && !this.disableAfter) return null
      const [before, after] = [
        moment(this.disableBefore),
        moment(this.disableAfter)
      ]
      return (d) => (before && moment(d).isBefore(before)) ||
                      (after && moment(d).isAfter(after))
    }
  },
  methods: {
    onInput (value) {
      this.$emit(commonEvents.inputEvent, value ? moment(value).format() : '')
    }
  }
}
</script>

<style scoped>

</style>
