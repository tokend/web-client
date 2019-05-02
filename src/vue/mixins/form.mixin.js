import { validationMixin } from 'vuelidate'
import config from '@/config'
import { inputStepByDigitsCount } from '@/js/helpers/input-trailing-digits-count'

import InputField from '../fields/InputField'
import SelectField from '../fields/SelectField'
import DateField from '../fields/DateField'
import TextareaField from '@/vue/fields/TextareaField'
import TickField from '@/vue/fields/TickField'
import FileField from '@/vue/fields/FileField'
import RadioField from '@/vue/fields/RadioField'
import MarkdownField from '@/vue/fields/MarkdownField'
import FormConfirmation from '@/vue/common/FormConfirmation'

import { globalize } from '@/vue/filters/globalize'

import safeGet from 'lodash/get'
import isObject from 'lodash/isObject'

export default {
  components: {
    InputField,
    SelectField,
    DateField,
    TextareaField,
    TickField,
    FileField,
    RadioField,
    MarkdownField,
    FormConfirmation,
  },
  mixins: [validationMixin],
  data: _ => ({
    formMixin: {
      isDisabled: false,
      isConfirmationShown: false,
    },
  }),
  methods: {
    /**
    * isFormValid checks if your form (or a part of it) meets
    * the validation rules, established for its fields.
    *
    * @param {string} [formPart] - the string with the form part name.
    *                 Works also for nested parts, such as `form.part1`.
    *
    * @returns {boolean} True if the form (or its part) meets
    *                    the validation rules or false if it does not.
    */
    isFormValid (formPart) {
      let form
      if (formPart) {
        form = safeGet(this.$v, formPart)
      } else {
        form = this.$v
      }

      if (!form) {
        // in case we have no validation rules at all
        return true
      }

      form.$touch()
      const isValid = !form.$invalid
      return isValid
    },
    /**
    * getFieldErrorMessage decides if the validation error is present
    * for the field. To be invalid the vuelidate $touch method should
    * be called on it. You have to call $touch on the level of your component,
    * the good time to do this is `input`, `change` or `blur` events:
    *
    *   <input-field
    *     v-model="form.email"
    *     @blur="$v.form.email.$touch()"
    *     :error-message="getFieldErrorMessage(`form.email`)"
    *  />
    *
    * @param {string} field - the string with the field name. Works also for
    *                 nested fields, such as `form.email`.
    * @param {Object} [options] - the interpolation options object for
    *                 translation.
    *
    * @returns {string} the human-readable error message if the
     *                  field is invalid, empty string - otherwise.
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
    selectedAssetStep (asset) {
      return inputStepByDigitsCount(asset.trailingDigitsCount) ||
        config.MIN_AMOUNT
    },
    clearFields () {
      this.clearFieldsWithOverriding({})
    },
    clearFieldsWithOverriding (overriddenFields) {
      for (const [fieldName, fieldValue] of Object.entries(this.form)) {
        if (overriddenFields[fieldName]) {
          this.form[fieldName] = overriddenFields[fieldName]
        } else if (typeof fieldValue === 'string') {
          this.form[fieldName] = ''
        } else if (typeof fieldValue === 'number') {
          this.form[fieldValue] = 0
        } else if (Array.isArray(fieldValue)) {
          this.form[fieldName] = []
        } else if (isObject(fieldValue)) {
          this.form[fieldName] = {}
        } else {
          continue
        }
      }
      this.$v.$reset()
    },
    touchField (fieldName) {
      const field = safeGet(this.$v, fieldName)
      if (field) {
        field.$touch()
      }
    },
    disableForm () {
      this.formMixin.isDisabled = true
    },
    enableForm () {
      this.formMixin.isDisabled = false
    },
    showConfirmation () {
      this.disableForm()
      this.formMixin.isConfirmationShown = true
    },
    hideConfirmation () {
      this.enableForm()
      this.formMixin.isConfirmationShown = false
    },
  },
}
