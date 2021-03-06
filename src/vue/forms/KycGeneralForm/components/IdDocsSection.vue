<template>
  <div class="id-docs-section">
    <h4 class="id-docs-section__title">
      {{ 'general-form.documents-lbl' | globalize }}
    </h4>

    <div class="app__form-row">
      <div class="app__form-field">
        <select-field
          v-model="idType"
          @input="touchField('idType'); former.setAttr('idDocType', idType)"
          name="id-document-type"
          :disabled="isDisabled"
          :label="'general-form.id-document-type-lbl' | globalize"
          :error-message="getFieldErrorMessage('idType')"
        >
          <option value="passport">
            {{ 'general-form.passport-lbl' | globalize }}
          </option>
          <option value="identity_card">
            {{ 'general-form.identity-card-lbl' | globalize }}
          </option>
          <option value="driving_license">
            {{ 'general-form.driving-license-lbl' | globalize }}
          </option>
          <option value="residence_permit">
            {{ 'general-form.residence-permit-lbl' | globalize }}
          </option>
        </select-field>
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <file-field
          v-model="idFace"
          @input="former.setAttr('idDocFace', idFace)"
          name="verification-general-id-document-face"
          :note="'general-form.file-type-note' | globalize"
          :file-extensions="['jpg', 'png', 'pdf']"
          :document-type="$DOCUMENT_TYPES.kycIdDocument"
          :label="'general-form.id-document-face-lbl' | globalize"
          :disabled="isDisabled"
          :error-message="getFieldErrorMessage('idFace')"
        />
      </div>
    </div>

    <div
      class="app__form-row"
      v-if="isBackRequired"
    >
      <div class="app__form-field">
        <file-field
          v-model="idBack"
          @input="former.setAttr('idDocBack', idBack)"
          name="verification-general-id-document-back"
          :note="'general-form.file-type-note' | globalize"
          :file-extensions="['jpg', 'png', 'pdf']"
          :document-type="$DOCUMENT_TYPES.kycIdDocument"
          :label="'general-form.id-document-back-lbl' | globalize"
          :disabled="isDisabled"
          :error-message="getFieldErrorMessage('idBack')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import formMixin from '@/vue/mixins/form.mixin'
import { required, requiredIf, nonEmptyDocument } from '@validators'
import { KycGeneralFormer } from '@/js/formers/KycGeneralFormer'

export default {
  name: 'id-docs-section',

  mixins: [formMixin],

  props: {
    former: {
      type: KycGeneralFormer,
      required: true,
    },
    isDisabled: {
      type: Boolean,
      default: true,
    },
  },

  data () {
    return {
      idType: this.former.attrs.idDocType || '',
      idFace: this.former.attrs.idDocFace || null,
      idBack: this.former.attrs.idDocBack || null,
    }
  },

  computed: {
    isBackRequired () {
      return this.idType !== 'passport'
    },
  },

  watch: {
    isBackRequired (isRequired) {
      if (isRequired && this.idBack) {
        this.former.setAttr('idDocBack', this.idBack)
        return
      }

      if (!isRequired && this.idBack) {
        this.former.unsetAttr('idDocBack')
      }
    },
  },

  validations: {
    idType: { required },
    idFace: { nonEmptyDocument },
    idBack: {
      required: requiredIf(function () { return this.isBackRequired }),
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/vue/forms/_app-form';
</style>
