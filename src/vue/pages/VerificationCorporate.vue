<template>
  <div class="verification-corporate">
    <h5 class="verification-container__heading">
      {{ 'general-form.account-information-lbl' | globalize }}
    </h5>

    <kyc-corporate-form
      class="verification-container__form"
      :former="former"
      @submitted="onFormSubmit"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { scrollToTop } from '@/js/helpers/scroll-helpers'
import { KycCorporateFormer } from '@/js/formers/KycCorporateFormer'
import KycCorporateForm from '@/vue/forms/KycCorporateForm'

export default {
  name: 'verification-corporate',

  components: {
    KycCorporateForm,
  },

  computed: {
    ...mapGetters({ kycRequest: vuexTypes.kycRequest }),

    former () {
      return new KycCorporateFormer(this.kycRequest)
    },
  },

  methods: {
    async onFormSubmit () {
      scrollToTop()
    },
  },
}
</script>

<style lang="scss" scoped>
@import './verification/styles';
</style>
