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
          name="verification-general-id-document-face"
          :note="'general-form.file-type-note' | globalize"
          accept="image/*, .pdf"
          :document-type="DOCUMENT_TYPES.kycIdDocument"
          :label="'general-form.id-document-face-lbl' | globalize"
          :disabled="isDisabled"
          :error-message="getFieldErrorMessage('idDocumentFace')"
        />
      </div>
    </div>

    <div class="app__form-row" v-if="needIdDocumentBack">
      <div class="app__form-field">
        <file-field
          v-model="idDocumentBack"
          name="verification-general-id-document-back"
          :note="'general-form.file-type-note' | globalize"
          accept="image/*, .pdf"
          :document-type="DOCUMENT_TYPES.kycIdDocument"
          :label="'general-form.id-document-back-lbl' | globalize"
          :disabled="isDisabled"
          :error-message="getFieldErrorMessage('idDocumentBack')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import SectionMixin from './section.mixin'

import { mapMutations, mapState } from 'vuex'
import { types } from '../store/types'

import { DOCUMENT_TYPES } from '@/js/const/document-types.const'
import { ID_DOCUMENT_TYPES } from '../id-document-types'

import {
  required,
  requiredIf,
  documentContainer,
} from '@/validators'

export default {
  name: 'section-documents',
  mixins: [FormMixin, SectionMixin],
  data: _ => ({
    DOCUMENT_TYPES,
    ID_DOCUMENT_TYPES,
  }),
  computed: {
    ...mapState('verification-general-form', {
      form: state => state.form,
    }),

    idDocumentType: {
      get () { return this.form.documents.idDocumentType },
      set (v) { this.setIdDocumentType(v) },
    },

    idDocumentFace: {
      get () { return this.form.documents.idDocumentFace },
      set (v) { this.setIdDocumentFace(v) },
    },
    idDocumentBack: {
      get () { return this.form.documents.idDocumentBack },
      set (v) { this.setIdDocumentBack(v) },
    },
    needIdDocumentBack () {
      return this.idDocumentType &&
        this.idDocumentType.value !== 'passport'
    },
  },
  validations: {
    idDocumentType: { required },
    idDocumentFace: { documentContainer },
    idDocumentBack: {
      required: requiredIf(function () {
        return this.needIdDocumentBack
      }),
    },
  },
  methods: {
    ...mapMutations('verification-general-form', {
      setIdDocumentType: types.SET_ID_DOCUMENT_TYPE,
      setIdDocumentFace: types.SET_ID_DOCUMENT_FACE,
      setIdDocumentBack: types.SET_ID_DOCUMENT_BACK,
    }),
  },
}
</script>

<style lang="scss" scoped>
  @import '../scss/styles';
</style>
