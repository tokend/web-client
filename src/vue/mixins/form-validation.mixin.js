import { globalize } from '@/vue/filters/globalize'
import safeGet from 'lodash/get'
import isObject from 'lodash/isObject'
import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
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
      let isInsideFormValid = true
      let form
      if (formPart) {
        form = safeGet(this.$v, formPart)
      } else {
        form = this.$v
        if (this.$children.length) {
          isInsideFormValid = this.$children.reduce((isValid, item) => {
            if (item.isFormValid) {
              return item.isFormValid() && isValid
            }
            return isValid
          }, true)
        }
      }
      if (!form) {
        // in case we have no validation rules at all
        return isInsideFormValid
      }
      form.$touch()
      const isValid = !form.$invalid
      return isValid && isInsideFormValid
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
     * @param {string} fieldPath - the string with the field name. Works also
     *                             for nested fields, such as `form.email`.
     * @param {Object} [options] - the interpolation options object for
     *                 translation.
     *
     * @returns {string} the human-readable error message if the
     *                  field is invalid, empty string - otherwise.
     */
    getFieldErrorMessage (fieldPath, options) {
      if (!fieldPath) {
        ErrorHandler.processWithoutFeedback('getFieldErrorMessage: "fieldPath" is required')
      }

      if (!this.$v || !this.$v.$invalid) {
        return ''
      }

      const field = this._extractVuelidateField(fieldPath)
      if (!field || !Object.keys(field).length) {
        ErrorHandler.processWithoutFeedback(`getFieldErrorMessage: Cannot extract vuelidate field by ${fieldPath.trim()}`)
      }

      if (!field.$dirty) {
        return ''
      }

      for (const rule of Object.keys(field.$params)) {
        if (!field[rule]) {
          return globalize(`validation.field-error`, {
            context: rule,
            ...options,
          })
        }
      }
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

      if (this.$children && this.$children.length) {
        this.$children
          .filter(item => item.$v)
          .forEach(item => item.$v.$reset())
      }
    },

    touchField (fieldName) {
      const field = safeGet(this.$v, fieldName)
      if (field) {
        field.$touch()
      }
    },

    _extractVuelidateField (fieldPath = '') {
      let resultFieldPath = fieldPath.trim().replace(
        /(\w+)(\[\d+\])/, // path like "array[12]"
        '$1.$each$2', // replace with "array.$each[12]"
      ) // all the others path should be treated unmodified

      return safeGet(this.$v, resultFieldPath)
    },
  },
}
