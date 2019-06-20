<template>
  <div class="verification-fund-form__section">
    <p class="verification-fund-form__section-label">
      {{ 'fund-form.documents-lbl' | globalize }}
    </p>

    <div class="app__form-row">
      <div class="app__form-field">
        <file-field
          v-model="idDocumentFace"
          name="verification-fund-id-document-face"
          :note="'fund-form.file-type-note' | globalize"
          :file-extensions="['jpg', 'png', 'pdf']"
          :document-type="DOCUMENT_TYPES.kycIdDocument"
          :disabled="isDisabled"
          :error-message="getFieldErrorMessage('idDocumentFace')"
        />
      </div>
    </div>

    <div class="app__form-row" v-if="needIdDocumentBack">
      <div class="app__form-field">
        <file-field
          v-model="idDocumentBack"
          name="verification-fund-id-document-back"
          :note="'fund-form.file-type-note' | globalize"
          :file-extensions="['jpg', 'png', 'pdf']"
          :document-type="DOCUMENT_TYPES.kycIdDocument"
          :label="'fund-form.id-document-back-lbl' | globalize"
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

import { mapMutations } from 'vuex'
import { types } from '../store/types'

import { DOCUMENT_TYPES } from '@/js/const/document-types.const'
import { ID_DOCUMENT_TYPES } from '../id-document-types'

import {
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
    idDocumentType: {
      get () { return this.callGetter(types.idDocumentType) },
      set (v) { this.setIdDocumentType(v) },
    },

    idDocumentFace: {
      get () { return this.callGetter(types.idDocumentFace) },
      set (v) { this.setIdDocumentFace(v) },
    },
    idDocumentBack: {
      get () { return this.callGetter(types.idDocumentBack) },
      set (v) { this.setIdDocumentBack(v) },
    },
    needIdDocumentBack () {
      return this.idDocumentType &&
        this.idDocumentType.value !== 'passport'
    },
  },
  validations: {
    idDocumentFace: { documentContainer },
    idDocumentBack: {
      required: requiredIf(function () {
        return this.needIdDocumentBack
      }),
    },
  },
  methods: {
    ...mapMutations('verification-fund-form', {
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
