<template>
  <div class="selfie-section">
    <h4 class="selfie-section__title">
      {{ 'general-form.photo-verification-lbl' | globalize }}
    </h4>

    <div class="app__form-row">
      <div class="app__form-field">
        <p class="selfie-section__explanation">
          {{ 'general-form.photo-explanation-msg' | globalize }}
        </p>
        <button
          v-ripple
          class="selfie-section__code-btn"
          :disabled="isDisabled"
          type="button"
          @click="isCodeShown = true"
        >
          <template v-if="isCodeShown">
            {{ verificationCode }}
          </template>

          <template v-else>
            {{ 'general-form.verification-code-btn' | globalize }}
          </template>
        </button>
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <file-field
          v-model="selfie"
          @input="former.setAttr('selfie', selfie)"
          name="verification-general-verification-photo"
          :note="'general-form.image-type-note' | globalize"
          :file-extensions="['jpg', 'png']"
          :document-type="$DOCUMENT_TYPES.kycSelfie"
          :label="'general-form.photo-lbl' | globalize"
          :disabled="isDisabled"
          :error-message="getFieldErrorMessage('selfie')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import formMixin from '@/vue/mixins/form.mixin'
import { nonEmptyDocument } from '@validators'
import { KycGeneralFormer } from '@/js/formers/KycGeneralFormer'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'selfie-section',

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
      isCodeShown: false,
      selfie: this.former.attrs.selfie || null,
    }
  },

  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
    }),

    verificationCode () {
      return this.accountId.slice(1, 6)
    },
  },

  validations: {
    selfie: { nonEmptyDocument },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/vue/forms/app-form';

.selfie-section__code-btn {
  @include button-raised;

  margin-top: 1.5rem;
}
</style>
