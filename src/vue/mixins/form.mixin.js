import { validationMixin } from 'vuelidate'

import FormValidationMixin from '@/vue/mixins/form-validation.mixin'
import InputField from '@/vue/fields/InputField'
import AmountInputField from '@/vue/fields/AmountInputField'
import SelectField from '@/vue/fields/SelectField'
import DateField from '@/vue/fields/DateField'
import TextareaField from '@/vue/fields/TextareaField'
import TickField from '@/vue/fields/TickField'
import FileField from '@/vue/fields/FileField'
import RadioField from '@/vue/fields/RadioField'
import MarkdownField from '@/vue/fields/MarkdownField'
import FormConfirmation from '@/vue/common/FormConfirmation'

export default {
  components: {
    InputField,
    AmountInputField,
    SelectField,
    DateField,
    TextareaField,
    TickField,
    FileField,
    RadioField,
    MarkdownField,
    FormConfirmation,
  },
  mixins: [FormValidationMixin, validationMixin],
  data: _ => ({
    formMixin: {
      isDisabled: false,
      isConfirmationShown: false,
    },
  }),
  methods: {
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
