<template>
  <div class="avatar-section">
    <h4 class="avatar-section__title">
      {{ 'general-form.avatar-lbl' | globalize }}
    </h4>

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
        />
      </div>
    </div>
  </div>
</template>

<script>
import formMixin from '@/vue/mixins/form.mixin'
import { KycGeneralFormer } from '@/js/formers/KycGeneralFormer'

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
}
</script>

<style lang="scss" scoped>
@import '~@/vue/forms/_app-form';
</style>
