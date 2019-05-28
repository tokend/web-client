import { globalize } from '@/vue/filters/globalize'
import safeGet from 'lodash/get'
import isObject from 'lodash/isObject'

export default {
  methods: {
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
  },
}
