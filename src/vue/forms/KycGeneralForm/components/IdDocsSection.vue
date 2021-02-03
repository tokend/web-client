<template>
  <div class="id-docs-section">
    <h4 class="id-docs-section__title">
      {{ 'general-form.documents-lbl' | globalize }}
    </h4>

    <div class="app__form-row">
      <div class="app__form-field">
        <file-field
          v-model="idFace"
          @input="former.setAttr('idDocFace', idFace)"
          name="verification-general-id-document-face"
          :note="'general-form.file-type-note' | globalize"
          :file-extensions="['jpg', 'png', 'pdf']"
          :document-type="$DOCUMENT_TYPES.kycIdDocument"
          label="Proof of Residence"
          :disabled="isDisabled"
        />
      </div>
    </div>
  </div>
</template>

<script>
import formMixin from '@/vue/mixins/form.mixin'
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
}
</script>

<style lang="scss" scoped>
@import '~@/vue/forms/_app-form';
</style>
