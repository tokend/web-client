<template>
  <div class="verification-form-container">
    <h5 class="verification-form-container__heading">
      {{ 'general-form.account-information-lbl' | globalize }}
    </h5>

    <template v-if="formToShow === 'general'">
      <kyc-general-form
        class="verification-form-container__form"
        :former="createGeneralFormer()"
        @submitted="onFormSubmit"
      />
    </template>

    <template v-else-if="formToShow === 'corporate'">
      <kyc-corporate-form
        class="verification-form-container__form"
        :former="createCorporateFormer()"
        @submitted="onFormSubmit"
      />
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { scrollToTop } from '@/js/helpers/scroll-helpers'
import { KycGeneralFormer } from '@/js/formers/KycGeneralFormer'
import { KycCorporateFormer } from '@/js/formers/KycCorporateFormer'
import { vueRoutes } from '@/vue-router/routes'
import KycGeneralForm from '@/vue/forms/KycGeneralForm'
import KycCorporateForm from './VerificationCorporate'

export default {
  name: 'verification-form-container',

  components: {
    KycGeneralForm,
    KycCorporateForm,
  },

  computed: {
    ...mapGetters({ kycRequest: vuexTypes.kycRequest }),

    formToShow () {
      switch (this.$route.name) {
        case vueRoutes.verificationGeneral.name: return 'general'
        case vueRoutes.verificationCorporate.name: return 'corporate'
        default: return 'UNKNOWN'
      }
    },
  },

  methods: {
    async onFormSubmit () {
      scrollToTop()
    },

    createGeneralFormer () {
      return new KycGeneralFormer(this.kycRequest)
    },

    createCorporateFormer () {
      return new KycCorporateFormer(this.kycRequest)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/vue/forms/_app-form';

.verification-form-container__heading {
  font-size: 1.3rem;
  font-weight: 400;
  margin-top: 4rem;
}

.verification-form-container__form {
  margin-top: 1rem;
  background-color: $col-block-bg;
  padding: 2.4rem;

  @include box-shadow();
}
</style>
