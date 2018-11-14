import InputField from 'L@/vue/common/fields/InputField.vue'
import SelectField from 'L@/vue/common/fields/SelectField.vue'
import TextareaField from 'L@/vue/common/fields/TextareaField'
import TextareaFieldUnchained from 'L@/vue/common/fields/TextareaFieldUnchained'
import DateField from 'L@/vue/common/fields/DateField'
import SelectFieldCustom from 'L@/vue/common/fields/SelectFieldCustom'
import SelectFieldUnchained from 'L@/vue/common/fields/SelectFieldUnchained'
import SelectFieldObjectUnchained from 'L@/vue/common/fields/SelectFieldObjectUnchained'
import InputFieldUnchained from 'L@/vue/common/fields/InputFieldUnchained'
import DateFieldFlatpickr from 'L@/vue/common/fields/DateFieldFlatpickr'
import TickField from 'L@/vue/common/fields/TickField'
import RadioField from 'L@/vue/common/fields/RadioField'

import ImageInput from '../DEPRECATED.inputs/ImageInput.vue'
import SubmitterMixin from './submitter.mixin'

import { EventDispatcher } from 'L@/js/events/event_dispatcher'
import { i18n } from 'L@/js/i18n'

export default {
  mixins: [SubmitterMixin],

  data () {
    return {
      form: {}
    }
  },

  components: {
    InputField,
    SelectField,
    SelectFieldCustom,
    InputFieldUnchained,
    SelectFieldUnchained,
    SelectFieldObjectUnchained,
    TextareaField,
    DateField,
    ImageInput,
    DateFieldFlatpickr,
    TickField,
    RadioField,
    TextareaFieldUnchained
  },

  methods: {
    async isValid () {
      if (!await this.$validator.validateAll()) {
        EventDispatcher.dispatchShowErrorEvent(i18n.cm_complete_validation())
        return false
      }
      return true
    },
    isValidDocs (types) {
      const docs = this.docs || this.documents
      if (!docs) return true
      for (const type of types) {
        if (!docs[type] || (!docs[type].file && !docs[type].key)) {
          EventDispatcher.dispatchShowErrorEvent(i18n.cm_upload_documents())
          return false
        }
      }
      return true
    },
    clear (exeptions = []) {
      this.$validator.reset()
      for (const key in this.form) {
        if (!exeptions.includes(key)) {
          this.form[key] = ''
        }
      }
    },
    hasError (field) {
      return this.errors.has(field)
    },
    errorMessage (field) {
      return this.errors.first(field)
    }
  }
}
