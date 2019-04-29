import { validationMixin } from 'vuelidate'

import InputField from '@/vue/fields/InputField'
import SelectField from '@/vue/fields/SelectField'
import DateField from '@/vue/fields/DateField'
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
      isFormSubmitting: false,
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
    /** START OF THE FORM SUBMITTING FLOW
     *
     * Form submitting flow looks like:
     * 1. Check that form can be submitted (`tryToSubmitForm`).
     * 2. Call method that will submit form after submit confirmation message
     *    that was shown after successful check in the first step.
     * 3. Preparing the properties that required for the correct
     *    form submitting (`startFormSubmitting`).
     * 4. The body of the form sender. A method or several methods that are
     *    declared in the component and send data and process it.
     * 5. Resetting the properties that required for the correct
     *    form submitting (`finishFormSubmitting`).
     *
     *
     * Three of these steps (1, 3, 5) is auxiliary and used everywhere through
     * application to make code reusable and clean.
     *
     * First step (`tryToSubmitForm`) should be used as handler for `submit`
     * form event.
     *
     * Example:
     * <form @submit.prevent="tryToSubmitForm">
     *  ...form code
     * </form>
     *
     *
     * Third and fifth steps used inside a method that was called in the second
     * step.
     *
     * Example:
     * someSubmitMethod () {
     *   this.startFormSubmitting()
     *
     *   ..body of the form sender (fought step)
     *
     *   this.finishFormSubmitting()
     * }
     */
    async tryToSubmitForm () {
      if (!await this.isFormValid()) return
      this.showConfirmation()
    },
    startFormSubmitting () {
      this.formMixin.isFormSubmitting = true
    },
    finishFormSubmitting () {
      this.formMixin.isFormSubmitting = false
      this.hideConfirmation()
    },
    /** END OF THE FORM SUBMITTING FLOW */

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
