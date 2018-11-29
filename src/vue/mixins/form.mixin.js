import { validationMixin } from 'vuelidate'

import InputField from '../fields/InputField'

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
      return !this.$v.$invalid
    },
    disableForm () {
      this.formMixin.isDisabled = true
    },
    enableForm () {
      this.formMixin.isDisabled = false
    }
  }
}
