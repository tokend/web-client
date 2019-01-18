import { validationMixin } from 'vuelidate'

import InputField from '@/vue/fields/InputField'
import SelectField from '@/vue/fields/SelectField'
import TextareaField from '@/vue/fields/TextareaField'
import TickField from '@/vue/fields/TickField'
import FileField from '@/vue/fields/FileField'
import { globalize } from '@/vue/filters/globalize'

import safeGet from 'lodash/get'

export default {
  components: {
    InputField,
    SelectField,
    TextareaField,
    TickField,
    FileField,
  },
  mixins: [validationMixin],
  data: _ => ({
    formMixin: {
      isDisabled: false,
    },
  }),
  methods: {
    /**
    * isFormValid checks if your form (or a part of it) meets
    * the validation rules, established for its fields.
    *
    * @param {string} formPart - the string with the form part name.
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
     *                nested fields, such as `form.email`.
    * @param {Object} options - the interpolation options object for
     *                translation.
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
    clearFields () {
      Object.keys(this.form).forEach(key => {
        this.form[key] = ''
      })
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
  },
}
