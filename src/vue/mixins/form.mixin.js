import { validationMixin } from 'vuelidate'

import InputField from '../fields/InputField'
import SelectField from '../fields/SelectField'
import DateField from '../fields/DateField'
import FileField from '@/vue/fields/FileField'

import { Bus } from '@/js/helpers/event-bus'
import { globalize } from '@/vue/filters/globalize'

import safeGet from 'lodash/get'

export default {
  components: {
    InputField,
    SelectField,
    DateField,
    FileField,
  },
  mixins: [validationMixin],
  data: _ => ({
    formMixin: {
      isDisabled: false,
    },
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
    /**
    * errorMessage decides if the validation error is present for the field. To
    * be invalid the vuelidate $touch method should be called on it. You have
    * to call $touch on the level of your component, the good time to do this is
    * `input`, `change` or `blur` events:
    *
    *   <input-field
    *     v-model="form.email"
    *     @blur="$v.form.email.$touch()"
    *     :error-message="errorMessage(`form.email`)"
    *  />
    *
    * @param {string} field - the string with the field name. Works also for
     *                nested fields, such as `form.email`.
    * @param {Object} options - the interpolation options object for
     *                translation.
    *
    * @returns {string} the human-readable error message if the
     *                  field is invalid, empty string - otherwise
    */
    getFieldErrorMessage (field, options) {
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
            context: rule,
            ...options,
          })
        }
      }
    },
    touchField (fieldName) {
      const field = safeGet(this.$v, fieldName)
      if (!field) {
        return
      }
      field.$touch()
    },
    disableForm () {
      this.formMixin.isDisabled = true
    },
    enableForm () {
      this.formMixin.isDisabled = false
    },
  },
}
