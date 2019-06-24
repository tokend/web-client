import safeGet from 'lodash/get'
import safeSet from 'lodash/set'
import { uploadDocument } from '@/js/helpers/upload-documents'

export default {
  props: {
    isDisabled: {
      type: Boolean,
      required: true,
    },
  },
  data: _ => ({
    form: {
      isAccredited: false,
      personal: {
        firstName: '',
        lastName: '',
        dateOfBirth: '',
      },
      address: {
        line1: '',
        line2: '',
        city: '',
        state: '',
        country: '', // { code, translation }
        postalCode: '',
      },
      documents: {
        idDocumentType: '', // { value, translationId }

        selfie: null,
        idDocumentFace: null,
        idDocumentBack: null,
        proofOfInvestor: null,
      },
    },
  }),

  methods: {
    setData (fieldType, value) {
      safeSet(this.form, fieldType, value)
    },

    getData (fieldType) {
      return safeGet(this.form, `${fieldType}`)
    },
    getFormData () {
      return this.form
    },

    async uploadDocuments () {
      await Promise.all([
        uploadDocument(this.form.documents.selfie),
        uploadDocument(this.form.documents.idDocumentFace),
        uploadDocument(this.form.documents.idDocumentBack),
        uploadDocument(this.form.documents.proofOfInvestor),
      ])
    },
  },
}
