<template>
  <div class="verification-general-form__block">
    <p class="verification-general-form__block-label">
      {{ 'general-form.photo-verification-lbl' | globalize }}
    </p>

    <div class="app__form-row">
      <div class="app__form-field">
        <p class="verification-general-form__photo-explanation">
          {{ 'general-form.photo-explanation-msg' | globalize }}
        </p>
        <button
          v-ripple
          class="verification-general-form__verification-code-btn"
          :disabled="isDisabled"
          @click.prevent="isCodeShown = true"
        >
          {{
            isCodeShown
              ? verificationCode
              : 'general-form.verification-code-btn' | globalize
          }}
        </button>
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <file-field
          v-model="selfie"
          name="verification-general-verification-photo"
          :note="'general-form.image-type-note' | globalize"
          accept="image/*"
          :document-type="DOCUMENT_TYPES.kycSelfie"
          :label="'general-form.photo-lbl' | globalize"
          :disabled="isDisabled"
          :error-message="getFieldErrorMessage('selfie')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import SectionMixin from './section.mixin'

import { DOCUMENT_TYPES } from '@/js/const/document-types.const'

import { mapState, mapMutations } from 'vuex'
import { types } from '../store/types'

import { documentContainer } from '@/validators'

export default {
  name: 'section-selfie',
  mixins: [FormMixin, SectionMixin],
  data: _ => ({
    isCodeShown: false,
    DOCUMENT_TYPES,
  }),
  validations: {
    selfie: { documentContainer },
  },
  computed: {
    ...mapState('verification-general-form', {
      form: state => state.form,
    }),
    selfie: {
      get () { return this.form.documents.selfie },
      set (v) { this.setSelfie(v) },
    },
    verificationCode () {
      // TODO
      return 'TODO'
    },
  },
  methods: {
    ...mapMutations('verification-general-form', {
      setSelfie: types.SET_SELFIE,
    }),
  },
}
</script>

<style lang="scss" scoped>
  @import '../scss/styles';
</style>
