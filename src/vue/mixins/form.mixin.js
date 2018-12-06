import { validationMixin } from 'vuelidate'

import InputField from '../fields/InputField'
import { Bus } from '@/js/helpers/event-bus'
import { globalize } from '@/vue/filters/globalize'

import safeGet from 'lodash/get'

export default {
  components: {
    InputField
  },
  mixins: [validationMixin],
  data: _ => ({
    formMixin: {
      isDisabled: false
    }
  }),
  methods: {
    isFormValid () {
      this.$v.$touch()
      const isValid = !this.$v.$invalid
      if (!isValid) {
        Bus.error('validation.failed')
      }
      return isValid
    },
    errorMessage (field) {
      if (!this.$v.$invalid) {
        return ''
      }

      const fieldDetails = safeGet(this.$v, field)

      if (!fieldDetails.$dirty) {
        return ''
      }

      for (const rule of Object.keys(fieldDetails.$params)) {
        if (!fieldDetails[rule]) {
          return globalize(`validation.field-error`, {
            context: rule
          })
        }
      }
    },
    disableForm () {
      this.formMixin.isDisabled = true
    },
    enableForm () {
      this.formMixin.isDisabled = false
    }
  }
}
