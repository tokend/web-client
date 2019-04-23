<template>
  <div class="verification-general-form__section">
    <p class="verification-general-form__section-label">
      {{ 'general-form.documents-lbl' | globalize }}
    </p>

    <div class="app__form-row">
      <div class="app__form-field">
        <select-field
          v-model="idDocumentType"
          name="id-document-type"
          key-as-value-text="labelTranslationId"
          :is-value-translatable="true"
          :values="ID_DOCUMENT_TYPES"
          :label="'general-form.id-document-type-lbl' | globalize"
          @blur="touchField('idDocumentType')"
          :error-message="getFieldErrorMessage('idDocumentType')"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <file-field
          v-model="idDocumentFace"
          name="verification-general-id-document"
          :note="'general-form.file-type-note' | globalize"
          accept="image/*, .pdf"
          :document-type="DOCUMENT_TYPES.kycIdDocument"
          :label="'general-form.id-document-lbl' | globalize"
          :disabled="formMixin.isDisabled"
          :error-message="getFieldErrorMessage('idDocumentFace')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'

import { mapMutations, mapState } from 'vuex'
import { types } from '../store/types'

import { DOCUMENT_TYPES } from '@/js/const/document-types.const'
import { documentContainer, required } from '@/validators'

const ID_DOCUMENT_TYPES = [ // TODO: should it be placed here?
  {
    value: 'passport',
    labelTranslationId: 'general-form.passport-lbl',
  },
  {
    value: 'identity_card',
    labelTranslationId: 'general-form.identity-card-lbl',
  },
  {
    value: 'driving_license',
    labelTranslationId: 'general-form.driving-license-lbl',
  },
  {
    value: 'residence_permit',
    labelTranslationId: 'general-form.residence-permit-lbl',
  },
]

export default {
  name: 'section-documents',
  mixins: [FormMixin],
  data: _ => ({
    DOCUMENT_TYPES,
    ID_DOCUMENT_TYPES,
  }),
  computed: {
    ...mapState('verification-general-form', {
      formData: state => state.formData,
    }),

    idDocumentType: {
      get () { return this.formData.documents.idDocumentType },
      set (v) { this.setIdDocumentType(v) },
    },

    idDocumentFace: {
      get () { return this.formData.documents.idDocumentFace },
      set (v) { this.setIdDocumentFace(v) },
    },
    idDocumentBack: {
      get () { return this.formData.documents.idDocumentBack },
      set (v) { this.setIdDocumentBack(v) },
    },
  },
  validations: {
    idDocumentType: { required },
    idDocumentFace: { documentContainer },
  },
  methods: {
    ...mapMutations('verification-general-form', {
      setIdDocumentType: types.SET_ID_DOCUMENT_TYPE,
      setIdDocumentFace: types.SET_DOCUMENT_ID_DOC_FACE,
      setIdDocumentBack: types.SET_DOCUMENT_ID_DOC_BACK,
    }),
  },
}
</script>

<style lang="scss" scoped>
  @import '../scss/styles';
</style>
