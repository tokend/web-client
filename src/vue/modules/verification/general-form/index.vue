<template>
  <div class="verification-general-form">
    <p class="verification-general-form__account-info-title">
      {{ 'general-form.account-information-lbl' | globalize }}
    </p>

    <form
      novalidate
      class="app-form"
      @submit.prevent="isAllFormsValid() && showConfirmation()"
    >
      <section-personal ref="personal-form" />
      <section-address ref="address-form" />
      <section-documents ref="documents-form" />
      <section-selfie ref="selfie-form" />
      <section-avatar ref="avatar-form" />

      <div class="app__form-actions">
        <form-confirmation
          v-if="formMixin.isConfirmationShown"
          @ok="hideConfirmation() || submit()"
          @cancel="hideConfirmation"
        />
        <button
          v-ripple
          v-else
          type="submit"
          class="verification-general-form__submit-btn"
          :disabled="formMixin.isDisabled"
        >
          {{ 'verification-form.submit-btn' | globalize }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'

import SectionPersonal from './components/section-personal'
import SectionAddress from './components/section-address'
import SectionDocuments from './components/section-documents'
import SectionSelfie from './components/section-selfie'
import SectionAvatar from './components/section-avatar'

import { types } from './store/types'
import { mapGetters } from 'vuex'

export default {
  name: 'verification-general-form',
  components: {
    SectionPersonal,
    SectionAddress,
    SectionDocuments,
    SectionSelfie,
    SectionAvatar,
  },
  mixins: [FormMixin],
  computed: {
    ...mapGetters('verification-general-form', {
      blobData: types.blobData,
    }),
  },
  methods: {
    isAllFormsValid () {
      let isValid = true

      // we need to trigger all invalid form errors, even if the first one
      // is not invalid
      Object.values(this.$refs).forEach(ref => { isValid = ref.isFormValid() })

      return isValid
    },
    submit () {
      // TODO
    },
  },
}
</script>

<style lang="scss" scoped>
@import './scss/styles';
</style>
