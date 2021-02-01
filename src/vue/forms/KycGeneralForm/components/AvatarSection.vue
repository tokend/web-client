<template>
  <div class="avatar-section">
    <div class="app__form-row">
      <div class="app__form-field">
        <file-field
          v-model="avatar"
          @input="former.setAttr('avatar', avatar)"
          name="verification-general-avatar"
          :note="'general-form.image-type-note' | globalize"
          :file-extensions="['jpg', 'png']"
          :document-type="$DOCUMENT_TYPES.kycAvatar"
          :label="'general-form.avatar-lbl' | globalize"
          :disabled="isDisabled"
          :error-message="getFieldErrorMessage('avatar')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import formMixin from '@/vue/mixins/form.mixin'
import { KycGeneralFormer } from '@/js/formers/KycGeneralFormer'
import { nonEmptyDocument } from '@validators'

export default {
  name: 'avatar-section',

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
      avatar: this.former.attrs.avatar || null,
    }
  },

  validations: {
    avatar: { nonEmptyDocument },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/vue/forms/_app-form';
</style>
