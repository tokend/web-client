import { validationMixin } from 'vuelidate'

import FieldMixin from '@/vue/mixins/field.mixin'
import InputField from '@/vue/fields/InputField'
import AssetSelectField from '@/vue/fields/AssetSelectField'
import AssetInputField from '@/vue/fields/AssetInputField'
import SelectField from '@/vue/fields/SelectField'
import DateField from '@/vue/fields/DateField'
import TextareaField from '@/vue/fields/TextareaField'
import TickField from '@/vue/fields/TickField'
import FileField from '@/vue/fields/FileField'
import RadioField from '@/vue/fields/RadioField'
import MarkdownField from '@/vue/fields/MarkdownField'
import FormConfirmation from '@/vue/common/FormConfirmation'

import safeGet from 'lodash/get'

export default {
  components: {
    InputField,
    AssetInputField,
    SelectField,
    AssetSelectField,
    DateField,
    TextareaField,
    TickField,
    FileField,
    RadioField,
    MarkdownField,
    FormConfirmation,
  },
  mixins: [FieldMixin, validationMixin],
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
